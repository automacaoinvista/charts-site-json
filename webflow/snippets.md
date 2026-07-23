# Snippets para o Webflow — um por fundo

**Passo 1 (uma vez por página):** cole o conteúdo de [`base-embed.html`](base-embed.html)
num HTML Embed no final da página (ou em *Page Settings → Custom Code → Footer Code*).

**Passo 2:** onde quiser cada gráfico/tabela, adicione um HTML Embed com o div correspondente abaixo.
Gráfico e tabela são independentes — use um, outro ou os dois, em qualquer ordem/layout.

> Os dados atualizam sozinhos (a VPS regenera os JSONs de hora em hora a partir do Excel).

---

## inVista Crédito Imobiliário US — Master (Dólar)

**Gráfico (Retorno Histórico):**
```html
<div class="invista-card">
  <div class="invista-chart" data-src="https://charts.automacaoinvista.me/credito.json"></div>
</div>
```

**Tabela (Performance Histórica):**
```html
<div class="invista-card">
  <div class="invista-table" data-src="https://charts.automacaoinvista.me/credito.json"></div>
</div>
```

---

## inVista Crédito Imobiliário US — Feeder Brasil (Reais)

**Gráfico (Retorno Histórico):**
```html
<div class="invista-card">
  <div class="invista-chart" data-src="https://charts.automacaoinvista.me/us-credit-feeder.json"></div>
</div>
```

**Tabela (Performance Histórica):**
```html
<div class="invista-card">
  <div class="invista-table" data-src="https://charts.automacaoinvista.me/us-credit-feeder.json"></div>
</div>
```

---

## inVista Brazilian Business Park — Cota Ordinária (Reais)

**Gráfico (Retorno Histórico):**
```html
<div class="invista-card">
  <div class="invista-chart" data-src="https://charts.automacaoinvista.me/ibbp11-ordinaria.json"></div>
</div>
```

**Tabela (Performance Histórica):**
```html
<div class="invista-card">
  <div class="invista-table" data-src="https://charts.automacaoinvista.me/ibbp11-ordinaria.json"></div>
</div>
```

---

## inVista Brazilian Business Park — Cota Sênior (Reais)

**Gráfico (Retorno Histórico):**
```html
<div class="invista-card">
  <div class="invista-chart" data-src="https://charts.automacaoinvista.me/ibbp11-senior.json"></div>
</div>
```

**Tabela (Performance Histórica):**
```html
<div class="invista-card">
  <div class="invista-table" data-src="https://charts.automacaoinvista.me/ibbp11-senior.json"></div>
</div>
```

---

## inVista Renda Imobiliária US — NNN Class A (Dólar)

**Gráfico (Retorno Histórico):**
```html
<div class="invista-card">
  <div class="invista-chart" data-src="https://charts.automacaoinvista.me/nnn-class-a.json"></div>
</div>
```

**Tabela (Performance Histórica):**
```html
<div class="invista-card">
  <div class="invista-table" data-src="https://charts.automacaoinvista.me/nnn-class-a.json"></div>
</div>
```

---

## inVista Renda Imobiliária US — NNN Class B (Dólar)

**Gráfico (Retorno Histórico):**
```html
<div class="invista-card">
  <div class="invista-chart" data-src="https://charts.automacaoinvista.me/nnn-class-b.json"></div>
</div>
```

**Tabela (Performance Histórica):**
```html
<div class="invista-card">
  <div class="invista-table" data-src="https://charts.automacaoinvista.me/nnn-class-b.json"></div>
</div>
```

---

## inVista Renda Imobiliária US — RTC Amazon (Dólar)

**Gráfico (Retorno Histórico):**
```html
<div class="invista-card">
  <div class="invista-chart" data-src="https://charts.automacaoinvista.me/rtc-amazon.json"></div>
</div>
```

**Tabela (Performance Histórica):**
```html
<div class="invista-card">
  <div class="invista-table" data-src="https://charts.automacaoinvista.me/rtc-amazon.json"></div>
</div>
```

---

## FIP RTC (Reais)

**Gráfico (Retorno Histórico):**
```html
<div class="invista-card">
  <div class="invista-chart" data-src="https://charts.automacaoinvista.me/fip-rtc.json"></div>
</div>
```

**Tabela (Performance Histórica):**
```html
<div class="invista-card">
  <div class="invista-table" data-src="https://charts.automacaoinvista.me/fip-rtc.json"></div>
</div>
```
