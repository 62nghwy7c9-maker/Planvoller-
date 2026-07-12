/* ============================================================
   PLANVOLLER — Suche
   Client-seitige Suche über einen statischen Index
   (Seiten, 15 Schritte, Referenzen, Blog). Overlay im Ink-Stil,
   Trigger: Lupe im Header + Ctrl/Cmd+K. Kein Backend nötig.
   ============================================================ */
(function () {
  "use strict";

  var toggle = document.querySelector(".search-toggle");
  if (!toggle) return;

  var overlay, input, results, index = null;

  function build() {
    overlay = document.createElement("div");
    overlay.className = "search-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Suche");
    overlay.innerHTML =
      '<button class="search-close" type="button" aria-label="Suche schließen">×</button>' +
      '<div class="shell">' +
      '<form role="search"><input type="search" placeholder="Wonach suchen Sie?" ' +
      'aria-label="Suchbegriff" autocomplete="off"><kbd>ESC</kbd></form>' +
      '<div class="search-results" role="listbox" aria-label="Suchergebnisse"></div>' +
      "</div>";
    document.body.appendChild(overlay);
    input = overlay.querySelector("input");
    results = overlay.querySelector(".search-results");

    overlay.querySelector("form").addEventListener("submit", function (e) { e.preventDefault(); });
    overlay.querySelector(".search-close").addEventListener("click", close);
    input.addEventListener("input", function () { render(query(input.value)); });
  }

  function load() {
    if (!index && window.__SEARCH_INDEX) index = window.__SEARCH_INDEX; // Inline-Bundle
    if (index) return Promise.resolve(index);
    return fetch("assets/data/search-index.json")
      .then(function (r) { return r.json(); })
      .then(function (data) { index = data; return index; });
  }

  function norm(s) {
    return s.toLowerCase()
      .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss");
  }

  function query(q) {
    q = norm(q.trim());
    if (q.length < 2 || !index) return null;
    var terms = q.split(/\s+/);
    return index
      .map(function (item) {
        var hay = norm(item.title + " " + (item.text || "") + " " + (item.cat || ""));
        var score = 0;
        terms.forEach(function (t) {
          if (norm(item.title).indexOf(t) !== -1) score += 3;
          else if (hay.indexOf(t) !== -1) score += 1;
        });
        return { item: item, score: score };
      })
      .filter(function (r) { return r.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, 8)
      .map(function (r) { return r.item; });
  }

  function render(items) {
    if (items === null) { results.innerHTML = ""; return; }
    if (!items.length) {
      results.innerHTML = '<p class="sr__empty">Keine Treffer. Fragen Sie uns direkt: ' +
        '<a href="mailto:info@planvoller.de">info@planvoller.de</a></p>';
      return;
    }
    results.innerHTML = items.map(function (item) {
      return '<a href="' + item.url + '" role="option">' +
        '<span class="sr__cat">' + item.cat + "</span>" +
        '<span class="sr__title">' + item.title + "</span>" +
        (item.text ? '<span class="sr__text">' + item.text + "</span>" : "") +
        "</a>";
    }).join("");
  }

  function open() {
    if (!overlay) build();
    load().then(function () { render(query(input.value)); });
    document.body.classList.add("search-open");
    document.body.style.overflow = "hidden";
    toggle.setAttribute("aria-expanded", "true");
    setTimeout(function () { input.focus(); }, 350);
  }

  function close() {
    document.body.classList.remove("search-open");
    document.body.style.overflow = "";
    toggle.setAttribute("aria-expanded", "false");
    toggle.focus();
  }

  toggle.addEventListener("click", function () {
    document.body.classList.contains("search-open") ? close() : open();
  });
  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      document.body.classList.contains("search-open") ? close() : open();
    }
    if (e.key === "Escape" && document.body.classList.contains("search-open")) close();
  });
})();
