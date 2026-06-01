# Gráficos institucionais inVista — Excel → JSON → Webflow (ECharts)

Arquitetura **100% gratuita**, sem Power Automate e sem Azure pago:

```
Excel Online (SharePoint)
        │  Microsoft Graph (app-only)
        ▼
build_charts.py  ──►  docs/*.json
        │  GitHub Actions (cron de hora em hora)
        ▼
GitHub Pages (URL pública)  ──►  Webflow + Apache ECharts
```

O time **só atualiza o Excel**. O GitHub Actions lê a planilha, gera os JSON e
publica. O Webflow nunca precisa ser editado.

---

## 1. Estrutura

| Arquivo | O quê |
|---|---|
| `config.json` | Lista de fundos: tabela, colunas, cores, título e modo do gráfico |
| `build_charts.py` | Lê o Excel via Graph e gera `docs/<fundo>.json` |
| `docs/` | O que o GitHub Pages publica (JSONs + página de preview) |
| `webflow/echarts-embed.html` | Componente ECharts genérico pra colar no Webflow |
| `.github/workflows/build.yml` | Automação (cron + deploy do Pages) |

## 2. Rodar localmente (teste)

```powershell
pip install -r requirements.txt
# crie um .env a partir do .env.example com as credenciais
python build_charts.py
```

Abra `docs/index.html` pra ver os gráficos.

## 3. Publicar no GitHub (uma vez)

1. Crie um repositório (ex.: `invista-charts`) e suba esta pasta.
2. Em **Settings → Secrets and variables → Actions**, crie 3 secrets:
   - `SP_TENANT_ID`
   - `SP_CLIENT_ID`
   - `SP_CLIENT_SECRET`
3. Em **Settings → Pages**, em *Build and deployment*, selecione **GitHub Actions**.
4. Em **Actions**, rode o workflow *"Atualizar JSON dos gráficos"* (botão *Run workflow*).

As URLs públicas (repositório já configurado) são:

```
https://automacaoinvista.github.io/charts-site-json/credito.json
https://automacaoinvista.github.io/charts-site-json/index.json   (lista dos fundos)
https://automacaoinvista.github.io/charts-site-json/             (página de preview)
```

> **Domínio próprio (opcional):** para `https://charts.invista.me/...`, em
> *Settings → Pages → Custom domain* coloque `charts.invista.me` e crie um CNAME
> no DNS apontando para `SEU-USUARIO.github.io`.

## 4. Usar no Webflow

1. Num **HTML Embed**, cole `webflow/echarts-embed.html`.
2. Troque o `data-src` pela URL pública do JSON.
3. Mais gráficos na mesma página = só repetir a `<div class="invista-chart" data-src="...">`.

## 5. Adicionar um novo fundo

Edite `config.json`, adicione um objeto em `funds` com `output`, `share_url`
(ou `drive_id`+`item_id`), `table`, `date_column`, `mode` e `series`.
Comite — o Actions gera `docs/<output>.json` automaticamente.

### Modos de gráfico (`mode`)
| valor | o que plota |
|---|---|
| `cumulative_100` | acumulado base 100 (padrão institucional) |
| `cumulative_pct` | retorno acumulado em % (começa em 0%) |
| `monthly` | retorno mensal em % (barras) |

## 6. Segurança

- O `.env` está no `.gitignore` — credenciais **não** vão pro repositório.
- Em produção, as credenciais ficam só nos **Secrets** do GitHub.
- **Rotacione o client secret** (você já mencionou) e atualize o secret no GitHub.
- Permissão Graph necessária: `Sites.Read.All` ou `Files.Read.All` (application).
