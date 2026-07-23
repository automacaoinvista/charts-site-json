/* inVista Charts — motor auto-contido (https://charts.automacaoinvista.me/embed.js)
   Cole no Webflow (HTML Embed) o snippet completo por elemento — ver webflow/snippets.md.
   Pode repetir em varios embeds na mesma pagina; o motor carrega uma vez so.
   Highcharts: uso comercial exige licenca valida (ver README). */
(function () {
  if (window.__invistaEmbedJs) {
    if (window.__invistaBoot) window.__invistaBoot();
    return;
  }
  window.__invistaEmbedJs = true;

  var st = document.createElement("style");
  st.textContent = ".invista-card{ font-family:\"Inter\",system-ui,sans-serif;\n    background:#FBF9F0;\n    border:1px solid #EFE9D8;\n    border-radius:18px;\n    padding:22px 24px;\n    box-sizing:border-box;\n  }\n  .invista-chart{ width:100%; height:clamp(300px,46vw,440px); }\n  .invista-bench-toggle{ display:flex; gap:6px; justify-content:flex-end; margin:0 0 4px; flex-wrap:wrap; }\n  .invista-bench-toggle button{ border:1px solid #E7E1D0; background:#fff; color:#1F2937;\n    font-family:inherit; font-size:13px; font-weight:500; line-height:1; padding:8px 14px;\n    border-radius:999px; cursor:pointer; }\n  .invista-bench-toggle button.active{ background:#0E2A38; color:#fff; border-color:#0E2A38; }\n  .invista-table-head{ display:flex; justify-content:flex-start; align-items:center;\n    gap:16px; flex-wrap:wrap; margin:0 0 12px; }\n  .invista-table-head h3{ margin:0; color:#0E2A38; font-size:22px; font-weight:800;\n    font-family:\"PP Watch\",\"PPWatch\",Georgia,serif; }\n  .invista-table-scroll{ overflow-x:auto; }\n  .invista-table table{ width:100%; border-collapse:collapse; font-size:12.5px;\n    line-height:342%; color:#1F2937; }\n  .invista-table th, .invista-table td{ padding:0 4px; text-align:left;\n    border-bottom:1px solid #EFE9D8; white-space:nowrap; font-weight:300; }\n  .invista-table thead th{ color:#0E2A38; font-weight:600; }\n  .invista-table tbody th{ text-align:left; font-weight:600; color:#0E2A38; }\n  .invista-table td.sep, .invista-table th.sep{ border-left:1px solid #EFE9D8; padding-left:12px; }";
  document.head.appendChild(st);

  function withHighcharts(cb) {
    if (window.Highcharts) return cb();
    var s = document.createElement("script");
    s.src = "https://charts.automacaoinvista.me/highcharts.js";  // v11.4.8 auto-hospedado
    s.onload = cb;
    document.head.appendChild(s);
  }

  withHighcharts(function () {
(function () {
  if (window.__invistaChartsInit) return;
  window.__invistaChartsInit = true;

  var PALETTE = ["#138A3C", "#ECE600", "#0E9384", "#9CA3AF", "#1F2937"];
  function fmtPct(v){return v.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})+"%";}
  function fmtIdx(v){return v.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});}
  function hexA(hex,a){var h=hex.replace("#","");return "rgba("+parseInt(h.substr(0,2),16)+","+parseInt(h.substr(2,2),16)+","+parseInt(h.substr(4,2),16)+","+a+")";}

  function render(el, cfg) {
    var isPct = cfg.mode === "monthly" || cfg.mode === "cumulative_pct";
    var isBar = (cfg.type || (cfg.mode === "monthly" ? "bar" : "line")) === "bar";
    var fmt = isPct ? fmtPct : fmtIdx;
    var labels = cfg.labels || [];
    var last = labels.length - 1;
    var endpoints = cfg.xEndpoints;            // ex: ["Início","Atual"] ou null
    var hideY = !!cfg.hideYAxis;

    // com 2+ benchmarks, só o primeiro começa visível (os botões alternam)
    var benchIdx = [];
    (cfg.series || []).forEach(function (s, i) { if (s.benchmark) benchIdx.push(i); });
    var hasToggle = benchIdx.length >= 2;

    var series = (cfg.series || []).map(function (s, i) {
      var color = s.color || PALETTE[i % PALETTE.length];
      var area = cfg.area && !isBar && i === 0;
      var hidden = hasToggle && s.benchmark && i !== benchIdx[0];
      return {
        name: s.name, color: color,
        visible: !hidden, showInLegend: !hidden,
        type: isBar ? "column" : (area ? "areaspline" : "spline"),
        data: s.data,
        marker: { enabled: false, symbol: "circle", radius: 4, states: { hover: { enabled: true, radius: 5 } } },
        fillColor: area ? { linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [[0, hexA(color, 0.18)], [1, hexA(color, 0)]] } : undefined
      };
    });

    return Highcharts.chart(el, {
      chart: { backgroundColor: "transparent", style: { fontFamily: '"Inter", system-ui, sans-serif' },
        spacingLeft: endpoints ? 24 : 2, spacingRight: endpoints ? 24 : 6 },
      credits: { enabled: false },
      title: { text: cfg.title || "", align: "left", margin: 6,
        style: { color: "#0E2A38", fontSize: "20px", fontWeight: "600", lineHeight: "120%" } },
      subtitle: { text: cfg.subtitle || "", align: "left", style: { color: "#6B7280", fontSize: "13px" } },
      xAxis: {
        categories: labels, tickLength: 0, lineColor: "#E7E1D0",
        tickPositions: endpoints ? [0, last] : undefined,
        labels: endpoints
          ? { style: { color: "#0E2A38", fontWeight: "600", fontSize: "13px" }, overflow: "allow", allowOverlap: true,
              formatter: function () { if (this.pos === 0) return endpoints[0]; if (this.pos === last) return endpoints[1] || ""; return ""; } }
          : { style: { color: "#6B7280", fontSize: "12px" } }
      },
      yAxis: { visible: !hideY, title: { text: null }, gridLineColor: "#F0EBDC",
        labels: { style: { color: "#6B7280", fontSize: "12px" }, formatter: function () { return fmt(this.value); } } },
      legend: { align: "left", verticalAlign: "bottom", x: -4, symbolRadius: 6, squareSymbol: false,
        itemStyle: { color: "#1F2937", fontWeight: "300", fontSize: "12px", lineHeight: "100%" } },
      tooltip: { shared: true, useHTML: true, backgroundColor: "rgba(14,42,56,0.94)", borderWidth: 0, borderRadius: 8,
        style: { color: "#fff" },
        formatter: function () {
          var html = '<div style="font-weight:600;margin-bottom:4px">' + this.points[0].key + "</div>";
          this.points.forEach(function (pt) {
            html += '<div><span style="color:' + pt.color + '">●</span> ' + pt.series.name + ": " + fmt(pt.y) + "</div>";
          });
          return html;
        }
      },
      plotOptions: { series: { lineWidth: 3, states: { hover: { lineWidthPlus: 0, halo: { size: 6 } } } } },
      series: series,
      responsive: { rules: [
        { condition: { maxWidth: 560 }, chartOptions: {
            title: { style: { fontSize: "17px" } }, subtitle: { style: { fontSize: "11px" } },
            legend: { layout: "horizontal", useHTML: true,
              itemStyle: { fontSize: "11px", fontWeight: "300", width: "300px", whiteSpace: "normal", lineHeight: "15px" } },
            xAxis: { labels: { style: { fontSize: endpoints ? "12px" : "9px" } } },
            yAxis: { labels: { style: { fontSize: "9px" } } } } },
        { condition: { minWidth: 561, maxWidth: 860 }, chartOptions: {
            title: { style: { fontSize: "20px" } }, legend: { layout: "horizontal" },
            xAxis: { labels: { style: { fontSize: endpoints ? "13px" : "10px" } } } } }
      ] }
    });
  }

  function addBenchToggle(el, chart, cfg) {
    var idxs = [];
    (cfg.series || []).forEach(function (s, i) { if (s.benchmark) idxs.push(i); });
    if (idxs.length < 2) return;
    var bar = document.createElement("div");
    bar.className = "invista-bench-toggle";
    idxs.forEach(function (si, k) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = cfg.series[si].name;
      if (k === 0) b.className = "active";
      b.onclick = function () {
        idxs.forEach(function (sj) {
          chart.series[sj].update({ visible: sj === si, showInLegend: sj === si }, false);
        });
        chart.redraw();
        Array.prototype.forEach.call(bar.children, function (c) {
          c.className = (c === b) ? "active" : "";
        });
      };
      bar.appendChild(b);
    });
    el.parentNode.insertBefore(bar, el);
  }

  var MESES = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
  var MES_HDR = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  function fmtCell(v){ return (v === null || v === undefined) ? "-" : fmtPct(v); }

  function renderTable(el, cfg) {
    var fund = (cfg.series || [])[0];
    var benches = (cfg.series || []).filter(function (s) { return s.benchmark; });
    if (!fund || !fund.monthly) { el.textContent = "Sem dados."; return; }
    var byLabel = {};
    (cfg.labels || []).forEach(function (lab, i) { if (i > 0) byLabel[lab] = fund.monthly[i]; });
    var years = [];
    (cfg.labels || []).slice(1).forEach(function (lab) {
      var y = 2000 + parseInt(lab.split("/")[1], 10);
      if (years.indexOf(y) < 0) years.push(y);
    });
    years.sort(function (a, b) { return b - a; });
    var selBench = 0;
    function build() {
      var b = benches[selBench];
      var html = '<div class="invista-table-head"><h3>Performance Histórica</h3>';
      if (benches.length > 1) {
        html += '<div class="invista-bench-toggle">' + benches.map(function (x, k) {
          return '<button type="button" data-k="' + k + '" class="' + (k === selBench ? "active" : "") + '">' + x.name + "</button>";
        }).join("") + "</div>";
      }
      html += '</div><div class="invista-table-scroll"><table><thead><tr><th>Ano</th>' +
        MES_HDR.map(function (m) { return "<th>" + m + "</th>"; }).join("") +
        '<th class="sep">Ano</th>' + (b ? "<th>" + b.name.replace(/^Benchmark:\s*/, "") + "</th>" : "") + "</tr></thead><tbody>";
      years.forEach(function (y) {
        html += "<tr><th>" + y + "</th>";
        for (var m = 0; m < 12; m++) {
          var lab = MESES[m] + "/" + ("0" + (y % 100)).slice(-2);
          html += "<td>" + fmtCell(byLabel.hasOwnProperty(lab) ? byLabel[lab] : null) + "</td>";
        }
        html += '<td class="sep">' + fmtCell(fund.yearly ? fund.yearly[y] : null) + "</td>";
        if (b) html += "<td>" + fmtCell(b.yearly ? b.yearly[y] : null) + "</td>";
        html += "</tr>";
      });
      html += "</tbody></table></div>";
      el.innerHTML = html;
      el.querySelectorAll(".invista-bench-toggle button").forEach(function (btn) {
        btn.onclick = function () { selBench = +btn.getAttribute("data-k"); build(); };
      });
    }
    build();
  }

  function boot() {
    document.querySelectorAll(".invista-table[data-src]").forEach(function (el) {
      if (el.__invistaDone) return;
      el.__invistaDone = true;
      fetch(el.getAttribute("data-src"), { cache: "no-store" })
        .then(function (r) { return r.json(); })
        .then(function (cfg) { renderTable(el, cfg); })
        .catch(function (e) { el.textContent = "Não foi possível carregar a tabela."; console.error("[invista-table]", e); });
    });
    document.querySelectorAll(".invista-chart[data-src]").forEach(function (el) {
      if (el.__invistaDone) return;
      el.__invistaDone = true;
      fetch(el.getAttribute("data-src"), { cache: "no-store" })
        .then(function (r) { return r.json(); })
        .then(function (cfg) {
          var chart = render(el, cfg);
          addBenchToggle(el, chart, cfg);
          var raf;
          function doResize(){ cancelAnimationFrame(raf); raf = requestAnimationFrame(function(){ chart.reflow(); }); }
          new ResizeObserver(doResize).observe(el);
          window.addEventListener("resize", doResize);
          window.addEventListener("orientationchange", doResize);
        })
        .catch(function (e) {
          el.innerHTML = '<div style="color:#9CA3AF;font:14px sans-serif;display:flex;'
            + 'align-items:center;justify-content:center;height:100%">Não foi possível carregar o gráfico.</div>';
          console.error("[invista-chart]", e);
        });
    });
  }

  window.__invistaBoot = boot;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
  });
})();
