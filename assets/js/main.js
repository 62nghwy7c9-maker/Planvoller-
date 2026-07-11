/* ============================================================
   PLANVOLLER — Motion-Engine
   Leitmotiv „Das Fügen": Elemente treffen versetzt ein und
   rasten präzise ein (Expo-Out), danach zeichnet sich die Fuge.
   Ein Easing-System, eine Dauer-Skala: 0.2 / 0.4 / 0.7 s.
   Degradiert vollständig: ohne GSAP/JS bleibt alles sichtbar.
   ============================================================ */
(function () {
  "use strict";

  var docEl = document.documentElement;
  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FINE = window.matchMedia("(pointer: fine)").matches;
  var DESKTOP = window.matchMedia("(min-width: 900px)");
  var HAS_GSAP = typeof window.gsap !== "undefined";

  if (REDUCED) docEl.classList.add("reduced");
  if (!HAS_GSAP) docEl.classList.add("no-gsap");

  /* Motion-Tokens (Spiegel der CSS-Tokens) */
  var EASE_SNAP = "expo.out";
  var DUR = { micro: 0.2, el: 0.4, scene: 0.7 };
  var STAGGER = 0.06;

  var lenis = null;

  document.addEventListener("DOMContentLoaded", function () {
    initHeader();
    initMenu();
    initFootYear();
    initForm();
    initCompare();

    if (!HAS_GSAP || REDUCED) return; // ruhige Vollversion: alles statisch sichtbar

    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: EASE_SNAP, duration: DUR.scene });

    initLenis();
    initSplitText();
    initReveals();
    initHairlines();
    initManifest();
    initCounters();
    initParallax();
    initSteps();
    if (FINE) {
      initCursor();
      initMagnetic();
    }

    // Nach Fonts/Bildern die Trigger-Positionen korrigieren (kein Layout-Shift-Risiko)
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  });

  /* ---------- Smooth-Scroll (Lenis) ---------- */
  function initLenis() {
    if (typeof window.Lenis === "undefined") return;
    lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // Anker-Links durch Lenis führen
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var target = document.querySelector(a.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -70 });
      });
    });
  }

  /* ---------- Kinetische Typografie: zeilenweise Masken-Reveals ---------- */
  function initSplitText() {
    document.querySelectorAll("[data-split]").forEach(function (el) {
      // Wörter in Zeilencontainer gruppieren (einfacher, robuster Zeilen-Split)
      var words = splitWords(el);
      var lines = groupLines(el, words);
      lines.forEach(function (line) {
        var inner = document.createElement("span");
        inner.className = "line-inner";
        var wrap = document.createElement("span");
        wrap.className = "line";
        line[0].parentNode.insertBefore(wrap, line[0]);
        wrap.appendChild(inner);
        line.forEach(function (w, i) {
          inner.appendChild(w);
          if (i < line.length - 1) inner.appendChild(document.createTextNode(" "));
        });
      });
      var inHero = !!el.closest(".hero");
      /* y:0 nullt den Pixel-Offset, den GSAP aus dem CSS-translateY(110%) parst */
      gsap.fromTo(el.querySelectorAll(".line-inner"),
        { yPercent: 110, y: 0 },
        {
          yPercent: 0, y: 0,
          duration: DUR.scene,
          stagger: STAGGER,
          delay: inHero ? 0.15 : 0,
          // Hero: Entrance beim Laden; sonst beim Einscrollen
          scrollTrigger: inHero ? undefined : { trigger: el, start: "top 88%", once: true }
        });
    });
  }

  function splitWords(el) {
    var words = [];
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var textNodes = [];
    while (walker.nextNode()) {
      if (walker.currentNode.nodeValue.trim()) textNodes.push(walker.currentNode);
    }
    textNodes.forEach(function (node) {
      var frag = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
        var w = document.createElement("span");
        w.className = "w";
        w.style.display = "inline-block";
        w.textContent = part;
        frag.appendChild(w);
        words.push(w);
      });
      node.parentNode.replaceChild(frag, node);
    });
    return words;
  }

  function groupLines(el, words) {
    var lines = [], current = [], top = null;
    words.forEach(function (w) {
      var t = w.offsetTop;
      if (top === null) top = t;
      if (Math.abs(t - top) > 4) { lines.push(current); current = []; top = t; }
      current.push(w);
    });
    if (current.length) lines.push(current);
    return lines;
  }

  /* ---------- Section-Reveals: das Fügen ---------- */
  function initReveals() {
    document.querySelectorAll("[data-reveal]").forEach(function (el, i) {
      var dir = el.getAttribute("data-reveal") || "up";
      var from = { opacity: 0 };
      if (dir === "up") from.y = 36;
      if (dir === "left") from.x = -36;
      if (dir === "right") from.x = 36;
      if (dir === "clip") { from.clipPath = "inset(0 0 100% 0)"; from.y = 0; }
      var inHero = !!el.closest(".hero");
      gsap.fromTo(el, from, {
        opacity: 1, x: 0, y: 0,
        clipPath: dir === "clip" ? "inset(0 0 0% 0)" : undefined,
        duration: DUR.scene,
        delay: (parseInt(el.getAttribute("data-reveal-delay") || "0", 10) * STAGGER)
               + (inHero ? 0.45 : 0),
        ease: EASE_SNAP,
        scrollTrigger: inHero ? undefined : { trigger: el, start: "top 88%", once: true },
        clearProps: "clipPath"
      });
    });
  }

  /* ---------- Haarlinien (Fugen) zeichnen sich ---------- */
  function initHairlines() {
    document.querySelectorAll(".hairline[data-draw]").forEach(function (el) {
      gsap.to(el, {
        scaleX: 1,
        duration: DUR.scene,
        ease: "power4.inOut",
        scrollTrigger: { trigger: el, start: "top 92%", once: true }
      });
    });
  }

  /* ---------- Manifest: Wörter werden per Scrub „gesetzt" ---------- */
  function initManifest() {
    document.querySelectorAll("[data-word-scrub]").forEach(function (el) {
      var words = splitWords(el).filter(function (w) { return !w.closest("em"); });
      if (!words.length) return;
      gsap.to(words, {
        color: getComputedStyle(docEl).getPropertyValue("--ink"),
        stagger: 0.06,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 78%",
          end: "bottom 45%",
          scrub: 0.4
        }
      });
    });
  }

  /* ---------- Zahlen-Count-up ---------- */
  function initCounters() {
    document.querySelectorAll("[data-count]").forEach(function (el) {
      var end = parseFloat(el.getAttribute("data-count"));
      var obj = { v: 0 };
      gsap.to(obj, {
        v: end,
        duration: DUR.scene * 2,
        ease: "power4.out",
        snap: { v: 1 },
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onUpdate: function () { el.textContent = String(Math.round(obj.v)); }
      });
    });
  }

  /* ---------- Parallax-Ebenen (nur transform) ---------- */
  function initParallax() {
    document.querySelectorAll("[data-parallax]").forEach(function (el) {
      var depth = parseFloat(el.getAttribute("data-parallax") || "12");
      gsap.fromTo(el, { yPercent: -depth / 2 }, {
        yPercent: depth / 2,
        ease: "none",
        scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true }
      });
    });
  }

  /* ---------- 15-Schritte-Scrollytelling (Pin + Scrub) ---------- */
  function initSteps() {
    var root = document.querySelector("[data-steps]");
    if (!root) return;

    var mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", function () {
      var steps = gsap.utils.toArray(root.querySelectorAll(".step"));
      var current = root.querySelector("[data-step-current]");
      var bar = root.querySelector("[data-step-bar]");
      var pin = root.querySelector(".steps__pin");
      if (steps.length < 2 || !pin) return;

      gsap.set(steps, { autoAlpha: 0, y: 44 });
      gsap.set(steps[0], { autoAlpha: 1, y: 0 });

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=" + steps.length * 55 + "%",
          pin: pin,
          scrub: 0.5,
          onUpdate: function (self) {
            var idx = Math.min(
              steps.length - 1,
              Math.floor(self.progress * steps.length)
            );
            if (current) current.textContent = pad(idx + 1);
            if (bar) bar.style.transform = "scaleX(" + self.progress + ")";
          }
        }
      });

      steps.forEach(function (step, i) {
        if (i === 0) return;
        tl.to(steps[i - 1], { autoAlpha: 0, y: -44, duration: 0.45, ease: "power4.in" }, i)
          .fromTo(step, { autoAlpha: 0, y: 44 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: EASE_SNAP }, i + 0.4);
      });
      // Ruhephase am Ende, damit Schritt 15 stehen bleibt
      tl.to({}, { duration: 0.6 });

      return function () { gsap.set(steps, { clearProps: "all" }); };
    });
  }

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  /* ---------- Vorher/Nachher-Regler (Rohbau → Zuhause) ---------- */
  function initCompare() {
    document.querySelectorAll("[data-compare]").forEach(function (box) {
      var pos = 50;
      var dragging = false;

      function set(p) {
        pos = Math.max(0, Math.min(100, p));
        box.style.setProperty("--pos", pos + "%");
        box.setAttribute("aria-valuenow", String(Math.round(pos)));
      }
      function fromEvent(e) {
        var r = box.getBoundingClientRect();
        set(((e.clientX - r.left) / r.width) * 100);
      }

      box.addEventListener("pointerdown", function (e) {
        dragging = true;
        box.setPointerCapture(e.pointerId);
        fromEvent(e);
      });
      box.addEventListener("pointermove", function (e) { if (dragging) fromEvent(e); });
      ["pointerup", "pointercancel"].forEach(function (ev) {
        box.addEventListener(ev, function () { dragging = false; });
      });
      box.addEventListener("keydown", function (e) {
        var step = { ArrowLeft: -5, ArrowRight: 5 }[e.key];
        if (step) { set(pos + step); e.preventDefault(); }
        if (e.key === "Home") { set(0); e.preventDefault(); }
        if (e.key === "End") { set(100); e.preventDefault(); }
      });

      /* Intro: Regler fährt kurz aus und rastet auf 50 % ein — zeigt die Interaktivität */
      if (HAS_GSAP && !REDUCED) {
        var obj = { p: 66 };
        gsap.to(obj, {
          p: 50,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: box, start: "top 75%", once: true },
          onStart: function () { if (!dragging) set(obj.p); },
          onUpdate: function () { if (!dragging) set(obj.p); }
        });
      }
    });
  }

  /* ---------- Magnetische Buttons ---------- */
  function initMagnetic() {
    document.querySelectorAll("[data-magnetic]").forEach(function (el) {
      var strength = 0.32;
      var xTo = gsap.quickTo(el, "x", { duration: DUR.el, ease: EASE_SNAP });
      var yTo = gsap.quickTo(el, "y", { duration: DUR.el, ease: EASE_SNAP });
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      });
      el.addEventListener("mouseleave", function () { xTo(0); yTo(0); });
    });
  }

  /* ---------- Kontext-Cursor ---------- */
  function initCursor() {
    var dot = document.createElement("div");
    var ring = document.createElement("div");
    dot.className = "cursor-dot";
    ring.className = "cursor-ring";
    ring.setAttribute("aria-hidden", "true");
    dot.setAttribute("aria-hidden", "true");
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var dx = gsap.quickTo(dot, "x", { duration: 0.08, ease: "none" });
    var dy = gsap.quickTo(dot, "y", { duration: 0.08, ease: "none" });
    var rx = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    var ry = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });

    window.addEventListener("mousemove", function (e) {
      docEl.classList.add("has-cursor");
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    }, { passive: true });

    document.addEventListener("mouseover", function (e) {
      var t = e.target;
      if (t.closest(".case, .post")) {
        docEl.classList.add("cursor-view"); docEl.classList.remove("cursor-hover");
      } else if (t.closest("a, button, input, select, textarea, label, [data-compare]")) {
        docEl.classList.add("cursor-hover"); docEl.classList.remove("cursor-view");
      } else {
        docEl.classList.remove("cursor-hover", "cursor-view");
      }
    }, { passive: true });
    document.addEventListener("mouseleave", function () {
      docEl.classList.remove("has-cursor");
    });
  }

  /* ---------- Header: verbergen beim Runterscrollen ---------- */
  function initHeader() {
    var head = document.querySelector(".site-head");
    if (!head) return;
    var last = 0;
    var onScroll = function () {
      var y = window.scrollY;
      head.classList.toggle("is-solid", y > 24);
      if (!document.body.classList.contains("menu-open")) {
        head.classList.toggle("is-hidden", y > 160 && y > last);
      }
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobil-Menü ---------- */
  function initMenu() {
    var toggle = document.querySelector(".menu-toggle");
    var overlay = document.querySelector(".menu-overlay");
    if (!toggle || !overlay) return;
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      overlay.setAttribute("aria-hidden", open ? "false" : "true");
      if (lenis) { open ? lenis.stop() : lenis.start(); }
      document.body.style.overflow = open ? "hidden" : "";
    });
    overlay.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
        if (lenis) lenis.start();
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) toggle.click();
    });
  }

  /* ---------- Formular (Kontakt) ---------- */
  function initForm() {
    var form = document.querySelector("[data-form]");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll("[required]").forEach(function (input) {
        var field = input.closest(".field");
        var ok = input.checkValidity();
        if (field) field.classList.toggle("is-invalid", !ok);
        if (!ok) valid = false;
      });
      if (!valid) {
        var firstInvalid = form.querySelector(".is-invalid input, .is-invalid textarea, .is-invalid select");
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      /* TODO Backend: hier per fetch() an den Formular-Endpoint senden
         (z. B. eigenes Script an info@planvoller.de). Aktuell nur UI-State. */
      form.classList.add("is-sent");
      var success = form.querySelector(".form__success");
      if (success) success.focus();
    });
    form.querySelectorAll("input, textarea, select").forEach(function (input) {
      input.addEventListener("input", function () {
        var field = input.closest(".field");
        if (field && input.checkValidity()) field.classList.remove("is-invalid");
      });
    });
  }

  function initFootYear() {
    var y = document.querySelector("[data-year]");
    if (y) y.textContent = new Date().getFullYear();
  }
})();
