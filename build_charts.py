#!/usr/bin/env python3
"""
Gera os arquivos JSON dos gráficos a partir das tabelas do Excel no SharePoint,
usando Microsoft Graph (app-only). Cada fundo é descrito em config.json e vira
um arquivo docs/<output>.json, que o GitHub Pages publica numa URL pública.

Rodar localmente:
    SP_TENANT_ID=...  SP_CLIENT_ID=...  SP_CLIENT_SECRET=...  python build_charts.py
ou crie um arquivo .env (ver .env.example) e rode:  python build_charts.py
"""
import base64
import datetime as dt
import json
import os
import sys
import urllib.parse
from pathlib import Path

import requests

ROOT = Path(__file__).parent
DOCS = ROOT / "docs"
GRAPH = "https://graph.microsoft.com/v1.0"
MESES_PT = ["jan", "fev", "mar", "abr", "mai", "jun",
            "jul", "ago", "set", "out", "nov", "dez"]


# ---------- credenciais / .env ----------
def load_dotenv():
    env = ROOT / ".env"
    if env.exists():
        for line in env.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip("'").strip('"'))


def get_token() -> str:
    tenant = os.environ["SP_TENANT_ID"]
    r = requests.post(
        f"https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token",
        data={
            "client_id": os.environ["SP_CLIENT_ID"],
            "client_secret": os.environ["SP_CLIENT_SECRET"],
            "scope": "https://graph.microsoft.com/.default",
            "grant_type": "client_credentials",
        },
        timeout=30,
    )
    r.raise_for_status()
    return r.json()["access_token"]


# ---------- resolução do arquivo ----------
def resolve_item(headers, fund):
    """Retorna (drive_id, item_id) a partir do config (direto ou via share_url)."""
    if fund.get("drive_id") and fund.get("item_id"):
        return fund["drive_id"], fund["item_id"]
    share_url = fund["share_url"]
    b64 = base64.urlsafe_b64encode(share_url.encode()).decode().rstrip("=")
    share_id = "u!" + b64
    r = requests.get(f"{GRAPH}/shares/{share_id}/driveItem", headers=headers, timeout=30)
    r.raise_for_status()
    item = r.json()
    return item["parentReference"]["driveId"], item["id"]


def read_table(headers, drive_id, item_id, table):
    base = f"{GRAPH}/drives/{drive_id}/items/{item_id}/workbook/tables/{table}"
    cols = requests.get(f"{base}/columns?$select=name,index", headers=headers, timeout=30)
    cols.raise_for_status()
    names = [c["name"] for c in cols.json()["value"]]
    rng = requests.get(f"{base}/range?$select=values", headers=headers, timeout=60)
    rng.raise_for_status()
    values = rng.json().get("values", [])
    return names, values[1:]  # values[0] é o cabeçalho


def read_worksheet(headers, drive_id, item_id, worksheet):
    """Lê o usedRange de uma aba; a primeira linha é o cabeçalho."""
    ws = urllib.parse.quote(worksheet)
    url = (f"{GRAPH}/drives/{drive_id}/items/{item_id}/workbook"
           f"/worksheets/{ws}/usedRange?$select=values")
    r = requests.get(url, headers=headers, timeout=60)
    r.raise_for_status()
    values = r.json().get("values", [])
    if not values:
        return [], []
    names = [str(c).strip() for c in values[0]]
    return names, values[1:]


# ---------- transformação ----------
def excel_serial_to_label(v):
    """Converte serial do Excel (ou string) em label pt-BR 'mmm/aa'."""
    if isinstance(v, (int, float)):
        d = dt.date(1899, 12, 30) + dt.timedelta(days=int(v))
        return f"{MESES_PT[d.month - 1]}/{d.year % 100:02d}"
    return str(v).strip()


def to_number(v):
    if v is None or v == "":
        return None
    if isinstance(v, (int, float)):
        return float(v)
    s = str(v).strip()
    if s in ("-", "N/A", "#N/A", "#VALUE!"):
        return None
    is_pct = s.endswith("%")
    s = s.replace("%", "").replace(".", "").replace(",", ".")
    try:
        n = float(s)
    except ValueError:
        return None
    # "0,67%" é percentual: converte pra decimal como as demais células (0.0067)
    return n / 100.0 if is_pct else n


def apply_mode(monthly_returns, mode):
    """monthly_returns: lista de retornos decimais (ex 0.0118). Retorna lista plotável."""
    out = []
    if mode == "monthly":
        return [round(r * 100, 2) for r in monthly_returns]
    acc = 1.0
    for r in monthly_returns:
        acc *= (1.0 + r)
        if mode == "cumulative_pct":
            out.append(round((acc - 1.0) * 100, 2))
        else:  # cumulative_100 (default)
            out.append(round(acc * 100, 2))
    return out


def build_fund(headers, fund):
    drive_id, item_id = resolve_item(headers, fund)
    if fund.get("worksheet"):
        names, rows = read_worksheet(headers, drive_id, item_id, fund["worksheet"])
    else:
        names, rows = read_table(headers, drive_id, item_id, fund["table"])
    idx = {n: i for i, n in enumerate(names)}

    # sem date_column no config, usa a primeira coluna
    date_i = idx[fund["date_column"]] if fund.get("date_column") else 0
    series_cfg = fund["series"]
    series_i = [idx[s["column"]] for s in series_cfg]

    # A 1ª série é o fundo: só entram no gráfico os meses em que ele tem cota.
    # Séries com "accumulated": true (benchmarks) já vêm acumuladas da planilha
    # e são plotadas direto. As demais são retornos mensais compostos pelo
    # apply_mode; em meses pulados (fundos trimestrais) o retorno é composto
    # no ponto seguinte via `pending`.
    accum = [bool(s.get("accumulated")) for s in series_cfg]
    if any(accum) and fund["mode"] == "monthly":
        raise ValueError(f"{fund['output']}: série 'accumulated' não suporta modo 'monthly'")
    labels, raw = [], [[] for _ in series_cfg]
    started = False
    first_serial = None
    pending = [1.0] * len(series_cfg)
    for row in rows:
        if row[date_i] in (None, ""):      # linhas em branco no fim da aba
            continue
        vals = [to_number(row[i]) for i in series_i]
        if vals[0] is None:                # mês sem cota do fundo
            if started:
                for k, v in enumerate(vals):
                    if v is not None and not accum[k]:
                        pending[k] *= (1.0 + v)
            continue
        # Linha "placeholder" de mês ainda sem fechamento: a cota vem 0 (PROCV de
        # célula vazia) — o acumulado do fundo fica parado — e o acumulado do
        # bench regride (reinicia na aba do fundo). Some do gráfico até o time
        # preencher os dados do mês.
        if raw[0]:
            fund_parado = (abs(vals[0] - raw[0][-1]) < 1e-12) if accum[0] else vals[0] == 0.0
            bench_regrediu = any(
                accum[k] and vals[k] is not None and vals[k] < raw[k][-1] - 1e-12
                for k in range(1, len(vals))
            )
            if fund_parado and bench_regrediu:
                continue
        started = True
        if first_serial is None:
            first_serial = row[date_i]
        labels.append(excel_serial_to_label(row[date_i]))
        for k, v in enumerate(vals):
            if accum[k]:
                if v is None:              # sem acumulado no mês: repete o anterior
                    v = raw[k][-1] if raw[k] else 0.0
                raw[k].append(v)
            else:
                raw[k].append((1.0 + (v if v is not None else 0.0)) * pending[k] - 1.0)
        pending = [1.0] * len(series_cfg)

    # ponto inicial: todas as séries partem de 0 no mês anterior ao 1º dado
    if labels:
        if isinstance(first_serial, (int, float)):
            d = dt.date(1899, 12, 30) + dt.timedelta(days=int(first_serial))
            y, m = (d.year, d.month - 1) if d.month > 1 else (d.year - 1, 12)
            labels.insert(0, f"{MESES_PT[m - 1]}/{y % 100:02d}")
        else:
            labels.insert(0, "Início")
        for data in raw:
            data.insert(0, 0.0)

    series = []
    for cfg, is_acc, data in zip(series_cfg, accum, raw):
        if is_acc:
            if fund["mode"] == "cumulative_pct":
                plot = [round(v * 100, 2) for v in data]
            else:  # cumulative_100
                plot = [round((1.0 + v) * 100, 2) for v in data]
        else:
            plot = apply_mode(data, fund["mode"])
        item = {"name": cfg["name"], "color": cfg["color"], "data": plot}
        if cfg.get("benchmark"):   # p/ o renderer agrupar benchmarks alternáveis
            item["benchmark"] = True
        if is_acc and labels:
            # p/ a tabela de performance: retorno de cada mês e total por ano,
            # derivados do acumulado sem arredondamento intermediário
            monthly = [None]
            for i in range(1, len(data)):
                monthly.append(round(((1.0 + data[i]) / (1.0 + data[i - 1]) - 1.0) * 100, 2))
            item["monthly"] = monthly
            yearly, prev = {}, 0.0
            year_last = {}
            for i in range(1, len(labels)):
                year_last[2000 + int(labels[i].split("/")[1])] = data[i]
            for yy in sorted(year_last):
                yearly[str(yy)] = round(((1.0 + year_last[yy]) / (1.0 + prev) - 1.0) * 100, 2)
                prev = year_last[yy]
            item["yearly"] = yearly
        series.append(item)

    # tipo visual: explícito no config, senão barra p/ mensal e linha p/ acumulado
    chart_type = fund.get("chart_type") or ("bar" if fund["mode"] == "monthly" else "line")

    return {
        "title": fund["title"],
        "subtitle": fund["subtitle"],
        "mode": fund["mode"],
        "type": chart_type,
        "xEndpoints": fund.get("x_endpoints"),   # ex: ["Início","Atual"] ou null
        "hideYAxis": fund.get("hide_y_axis", False),
        "labels": labels,
        "series": series,
        "updatedAt": os.environ.get("BUILD_TIME", ""),
    }


def main():
    load_dotenv()
    for k in ("SP_TENANT_ID", "SP_CLIENT_ID", "SP_CLIENT_SECRET"):
        if not os.environ.get(k):
            sys.exit(f"ERRO: variavel de ambiente {k} nao definida (veja .env.example)")

    config = json.loads((ROOT / "config.json").read_text(encoding="utf-8"))
    headers = {"Authorization": f"Bearer {get_token()}"}
    DOCS.mkdir(exist_ok=True)

    generated = []
    for fund in config["funds"]:
        data = build_fund(headers, fund)
        out = DOCS / f"{fund['output']}.json"
        out.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        generated.append(fund["output"])
        print(f"OK  {out.name}  ({len(data['labels'])} pontos, {len(data['series'])} séries)")

    # índice simples pra conferência
    index = {"funds": generated, "updatedAt": os.environ.get("BUILD_TIME", "")}
    (DOCS / "index.json").write_text(json.dumps(index, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Gerados {len(generated)} arquivo(s) em docs/")


if __name__ == "__main__":
    main()
