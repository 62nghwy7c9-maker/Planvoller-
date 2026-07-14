/* Planvoller — Digitaler Assistent
   Beantwortet häufige Bauherren-Fragen sofort im Browser (keine Datenübertragung).
   Optional: echtes KI-Backend anbinden, indem am Script-Tag das Attribut
   data-ai-endpoint="https://…" gesetzt wird
   (POST {question:"…"} → {answer:"…"}); ohne Endpoint antwortet die lokale Wissensbasis. */
(function () {
  "use strict";

  var ENDPOINT = (document.currentScript && document.currentScript.getAttribute("data-ai-endpoint")) || "";

  /* ---------- Wissensbasis (Inhalte von planvoller.de) ---------- */
  var KB = [
    { k: "ablauf schritte schritt prozess meilenstein meilensteine bauablauf phasen läuft",
      a: 'Wir bauen in <strong>15 klar definierten Schritten</strong> — vom Bauantrag (Schritt 01) über Richtfest (08) bis zur Schlüsselübergabe (15). Jeder Schritt ist ein Meilenstein mit klarem Ergebnis. Alle Details: <a href="ablauf.html">Der Ablauf</a>.' },
    { k: "preis preise kosten kostet festpreis teuer budget garantie euro preislich quadratmeter",
      a: 'Als Marktorientierung: Schlüsselfertige Massivhäuser liegen derzeit meist bei <strong>2.400–3.400 € pro m² Wohnfläche</strong>, plus 15–20 % Baunebenkosten. Was Ihr Haus konkret kostet, legen wir vor Vertragsschluss als <strong>Festpreis verbindlich</strong> fest. Mehr dazu: <a href="blog-kosten.html">Was kostet ein Massivhaus?</a> — oder direkt ein <a href="kontakt.html">kostenloses Erstgespräch</a>.' },
    { k: "faq fragen frage antworten häufige",
      a: 'Die häufigsten Fragen — von Ablauf über Kosten bis Bemusterung — beantworten wir gesammelt auf unserer <a href="faq.html">FAQ-Seite</a>. Und natürlich hier: Fragen Sie einfach!' },
    { k: "ratgeber pdf download checkliste herunterladen",
      a: 'Unser kostenloser <a href="ratgeber-planvoller.pdf" download>Ratgeber (PDF)</a> erklärt alle 15 Schritte ins Eigenheim — mit Checklisten für Grundstückskauf und Festpreis-Vergleich. Ohne Anmeldung.' },
    { k: "termin termine bauzeit dauer dauert lange fertigstellung fertig wann termintreue",
      a: 'Verlässlichkeit und Termintreue sind bei uns Programm: Der Ablaufplan wird zum Vertragsschluss <strong>verbindlich</strong> festgelegt — das erspart Ihnen kostspielige Terminverschiebungen. Mehr dazu unter <a href="planvoller.html">Warum Planvoller</a>.' },
    { k: "standort standorte adresse telefon nummer anrufen erreichen büro würselen kerpen bensberg finde finden",
      a: 'Sie erreichen uns an drei Standorten im Rheinland:<br><strong>Würselen</strong> — Morlaixplatz 15, +49 2405 6079832<br><strong>Kerpen</strong> — Ottostraße 4a, +49 2273 9918151<br><strong>Bensberg</strong> — Industrieweg 13, +49 177 4210010<br>Oder per E-Mail: <a href="mailto:info@planvoller.de">info@planvoller.de</a>' },
    { k: "grundstück grundstücke bauplatz bauland",
      a: 'Auch beim Thema Grundstück helfen wir weiter — erzählen Sie uns im <a href="kontakt.html">Anfrage-Formular</a> kurz, ob ein Grundstück vorhanden, in Aussicht oder noch gesucht ist, und wir melden uns mit einer ehrlichen Einschätzung.' },
    { k: "team ansprechpartner bauleiter architekt architekten mitarbeiter leute menschen",
      a: 'Bei uns haben Sie <strong>einen festen Ansprechpartner</strong> vom ersten Gespräch bis zur Schlüsselübergabe — plus einen erfahrenen Bauleiter über die gesamte Bauzeit. <a href="planvoller.html#team-h">Lernen Sie unser Team kennen</a>.' },
    { k: "referenz referenzen projekt projekte beispiel beispiele bilder häuser gebaut anschauen",
      a: 'Gern — sehen Sie sich unsere <a href="referenzen.html">Referenzen</a> an: Stadtvillen, Landhaus, Bungalow und Kubushaus, alle massiv gebaut und termingerecht übergeben.' },
    { k: "massiv massivbau bauweise stein individuell grundriss grundrisse fertighaus planung plant",
      a: 'Wir bauen <strong>massiv, Stein auf Stein</strong> — und planen jedes Haus individuell: Sie sind frei im Grundriss und in der Raumhöhengestaltung, an keine festen Pläne gebunden. So bekommt jeder Bauherr ein Unikat.' },
    { k: "finanzierung finanzieren kredit bank versicherung versicherungen",
      a: 'In Fragen der Baufinanzierung und Versicherungen empfehlen wir Ihnen <strong>regionale Profis</strong>, die Sie optimal begleiten. Sprechen Sie uns einfach an: <a href="kontakt.html">Kontakt</a>.' },
    { k: "behörde behörden bauantrag genehmigung formalitäten amt unterlagen papiere",
      a: 'Wir betreuen Sie bei allen Schritten und helfen bei Behördengängen und Antragsformalitäten rund um den Bau — der Bauantrag ist bei uns Schritt 01 von 15. Details: <a href="ablauf.html">Der Ablauf</a>.' },
    { k: "bemusterung ausstattung tapeten böden auswahl aussuchen",
      a: 'Dank verbindlichem Ablaufplan können Sie sich entspannt der Bemusterung und Einrichtung widmen — Tapeten aussuchen, Möbel bestellen, den Garten planen. Wie das eingebettet ist, zeigt <a href="ablauf.html">der Ablauf</a>.' },
    { k: "kontakt anfrage angebot beratung erstgespräch gespräch melden email mail schreiben",
      a: 'Der erste Schritt ist ein Gespräch: Stellen Sie Ihre <a href="kontakt.html">Bauanfrage</a> — wir melden uns innerhalb von zwei Werktagen mit einer ehrlichen Einschätzung.' }
  ];
  var FALLBACK = 'Das kann ich nicht sicher beantworten — aber unser Team kann es: Schreiben Sie an <a href="mailto:info@planvoller.de">info@planvoller.de</a> oder stellen Sie direkt eine <a href="kontakt.html">Bauanfrage</a>. Wir melden uns innerhalb von zwei Werktagen.';
  var CHIPS = ["Wie läuft der Bau ab?", "Was kostet ein Haus?", "Wo finde ich Sie?", "Zeigt mir Referenzen"];

  var STOP = " was wie ist sind ein eine einen bei euch ihre ihr sie der die das und mit für auch habt hat kann können mir ich wir uns den dem nach zum zur auf im es an um gibt denn noch mal von aus oder man ";
  function localAnswer(q) {
    var words = q.toLowerCase().replace(/[?!.,;:()"']/g, " ").split(/\s+/).filter(function (w) {
      return w.length > 2 && STOP.indexOf(" " + w + " ") === -1;
    });
    var best = null, bestScore = 0;
    KB.forEach(function (entry) {
      var toks = entry.k.split(" ");
      var score = 0;
      words.forEach(function (w) {
        for (var i = 0; i < toks.length; i++) {
          var t = toks[i];
          if (w === t) { score += 2; return; }
          if (w.length >= 4 && t.length >= 4 && (w.indexOf(t) === 0 || t.indexOf(w) === 0)) { score += 1; return; }
        }
      });
      if (score > bestScore) { bestScore = score; best = entry; }
    });
    return bestScore > 0 ? best.a : FALLBACK;
  }

  /* ---------- UI ---------- */
  var root = document.createElement("div");
  root.className = "assist";
  root.innerHTML =
    '<button type="button" class="assist__btn" aria-expanded="false" aria-controls="assist-panel">' +
    '<span class="assist__btn-open">Fragen?</span><span class="assist__btn-close" aria-hidden="true">×</span></button>' +
    '<section class="assist__panel" id="assist-panel" role="dialog" aria-label="Digitaler Assistent" hidden>' +
    '<header class="assist__head"><strong>Digitaler Assistent</strong>' +
    '<span>Beantwortet häufige Fragen sofort — direkt in Ihrem Browser, ohne Datenübertragung.</span></header>' +
    '<div class="assist__log" aria-live="polite"></div>' +
    '<div class="assist__chips"></div>' +
    '<form class="assist__form"><label class="visually-hidden" for="assist-q">Ihre Frage</label>' +
    '<input id="assist-q" type="text" placeholder="Ihre Frage …" autocomplete="off">' +
    '<button type="submit" aria-label="Frage senden">→</button></form>' +
    '</section>';
  document.body.appendChild(root);

  var btn = root.querySelector(".assist__btn");
  var panel = root.querySelector(".assist__panel");
  var log = root.querySelector(".assist__log");
  var chipsEl = root.querySelector(".assist__chips");
  var form = root.querySelector(".assist__form");
  var input = root.querySelector("#assist-q");

  function push(kind, html) {
    var m = document.createElement("div");
    m.className = "assist__msg assist__msg--" + kind;
    m.innerHTML = html;
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
  }

  function ask(q) {
    if (!q) return;
    push("user", q.replace(/&/g, "&amp;").replace(/</g, "&lt;"));
    if (ENDPOINT) {
      var wait = document.createElement("div");
      wait.className = "assist__msg assist__msg--bot";
      wait.textContent = "…";
      log.appendChild(wait);
      fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }) })
        .then(function (r) { if (!r.ok) throw 0; return r.json(); })
        .then(function (d) { wait.remove(); push("bot", d.answer || localAnswer(q)); })
        .catch(function () { wait.remove(); push("bot", localAnswer(q)); });
    } else {
      setTimeout(function () { push("bot", localAnswer(q)); }, 250);
    }
  }

  CHIPS.forEach(function (c) {
    var b = document.createElement("button");
    b.type = "button"; b.textContent = c;
    b.addEventListener("click", function () { ask(c); });
    chipsEl.appendChild(b);
  });

  var open = false;
  function toggle(state) {
    open = typeof state === "boolean" ? state : !open;
    btn.setAttribute("aria-expanded", String(open));
    panel.hidden = !open;
    root.classList.toggle("is-open", open);
    if (open) {
      if (!log.childElementCount) {
        push("bot", "Guten Tag! Ich beantworte Ihnen gern die häufigsten Fragen rund um Ablauf, Preis, Standorte und Referenzen. Was möchten Sie wissen?");
      }
      input.focus();
    }
  }
  btn.addEventListener("click", function () { toggle(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && open) toggle(false); });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = input.value.trim();
    input.value = "";
    ask(q);
  });
})();
