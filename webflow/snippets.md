# Snippets para o Webflow — copiar e colar, nada mais

Cada bloco abaixo é **autossuficiente**: cole num **HTML Embed** do Webflow e pronto.
Não precisa de Footer Code, configuração de página nem nada — pode repetir vários
na mesma página (o motor carrega uma vez só).

> **Idiomas (PT/EN/ES):** o motor escolhe o idioma sozinho pelo `<html lang>` da página
> (o Webflow Localization já ajusta isso em /en e /es). Para forçar, adicione
> `data-lang="en"` (ou `es`/`pt`) na `<div class="invista-chart">` / `invista-table`.
> Textos novos: adicionar em `I18N` no `docs/embed.js` (sem tradução, aparece em PT).

> Dados atualizam sozinhos (a VPS regenera os JSONs de hora em hora a partir do Excel).

---

## inVista Crédito Imobiliário US — Master (Dólar)

**Gráfico (Retorno Histórico):**
```html
<div class="invista-card">
  <div class="invista-chart" data-src="https://charts.automacaoinvista.me/credito.json"></div>
</div>
<script src="https://charts.automacaoinvista.me/embed.js" defer></script>
```

**Tabela (Performance Histórica):**
```html
<div class="invista-card">
  <div class="invista-table" data-src="https://charts.automacaoinvista.me/credito.json"></div>
</div>
<script src="https://charts.automacaoinvista.me/embed.js" defer></script>
```

---

## inVista Crédito Imobiliário US — Feeder Brasil (Reais)

**Gráfico (Retorno Histórico):**
```html
<div class="invista-card">
  <div class="invista-chart" data-src="https://charts.automacaoinvista.me/us-credit-feeder.json"></div>
</div>
<script src="https://charts.automacaoinvista.me/embed.js" defer></script>
```

**Tabela (Performance Histórica):**
```html
<div class="invista-card">
  <div class="invista-table" data-src="https://charts.automacaoinvista.me/us-credit-feeder.json"></div>
</div>
<script src="https://charts.automacaoinvista.me/embed.js" defer></script>
```

---

## inVista Brazilian Business Park — Cota Ordinária (Reais)

**Gráfico (Retorno Histórico):**
```html
<div class="invista-card">
  <div class="invista-chart" data-src="https://charts.automacaoinvista.me/ibbp11-ordinaria.json"></div>
</div>
<script src="https://charts.automacaoinvista.me/embed.js" defer></script>
```

**Tabela (Performance Histórica):**
```html
<div class="invista-card">
  <div class="invista-table" data-src="https://charts.automacaoinvista.me/ibbp11-ordinaria.json"></div>
</div>
<script src="https://charts.automacaoinvista.me/embed.js" defer></script>
```

---

## inVista Brazilian Business Park — Cota Sênior (Reais)

**Gráfico (Retorno Histórico):**
```html
<div class="invista-card">
  <div class="invista-chart" data-src="https://charts.automacaoinvista.me/ibbp11-senior.json"></div>
</div>
<script src="https://charts.automacaoinvista.me/embed.js" defer></script>
```

**Tabela (Performance Histórica):**
```html
<div class="invista-card">
  <div class="invista-table" data-src="https://charts.automacaoinvista.me/ibbp11-senior.json"></div>
</div>
<script src="https://charts.automacaoinvista.me/embed.js" defer></script>
```

---

## inVista Renda Imobiliária US — NNN Class A (Dólar)

**Gráfico (Retorno Histórico):**
```html
<div class="invista-card">
  <div class="invista-chart" data-src="https://charts.automacaoinvista.me/nnn-class-a.json"></div>
</div>
<script src="https://charts.automacaoinvista.me/embed.js" defer></script>
```

**Tabela (Performance Histórica):**
```html
<div class="invista-card">
  <div class="invista-table" data-src="https://charts.automacaoinvista.me/nnn-class-a.json"></div>
</div>
<script src="https://charts.automacaoinvista.me/embed.js" defer></script>
```

---

## inVista Renda Imobiliária US — NNN Class B (Dólar)

**Gráfico (Retorno Histórico):**
```html
<div class="invista-card">
  <div class="invista-chart" data-src="https://charts.automacaoinvista.me/nnn-class-b.json"></div>
</div>
<script src="https://charts.automacaoinvista.me/embed.js" defer></script>
```

**Tabela (Performance Histórica):**
```html
<div class="invista-card">
  <div class="invista-table" data-src="https://charts.automacaoinvista.me/nnn-class-b.json"></div>
</div>
<script src="https://charts.automacaoinvista.me/embed.js" defer></script>
```

---

## inVista Renda Imobiliária US — RTC Amazon (Dólar)

**Gráfico (Retorno Histórico):**
```html
<div class="invista-card">
  <div class="invista-chart" data-src="https://charts.automacaoinvista.me/rtc-amazon.json"></div>
</div>
<script src="https://charts.automacaoinvista.me/embed.js" defer></script>
```

**Tabela (Performance Histórica):**
```html
<div class="invista-card">
  <div class="invista-table" data-src="https://charts.automacaoinvista.me/rtc-amazon.json"></div>
</div>
<script src="https://charts.automacaoinvista.me/embed.js" defer></script>
```

---

## FIP RTC (Reais)

**Gráfico (Retorno Histórico):**
```html
<div class="invista-card">
  <div class="invista-chart" data-src="https://charts.automacaoinvista.me/fip-rtc.json"></div>
</div>
<script src="https://charts.automacaoinvista.me/embed.js" defer></script>
```

**Tabela (Performance Histórica):**
```html
<div class="invista-card">
  <div class="invista-table" data-src="https://charts.automacaoinvista.me/fip-rtc.json"></div>
</div>
<script src="https://charts.automacaoinvista.me/embed.js" defer></script>
```
