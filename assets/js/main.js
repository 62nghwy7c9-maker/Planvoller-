/* Planvoller GmbH — main.js (v3)
   Schlankes Vanilla-JS: Menü, Reveal, Zähler, Vorher/Nachher, Formular. */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header-Schatten beim Scrollen ---------- */
  var head = document.querySelector(".site-head");
  if (head) {
    var onScroll = function () { head.classList.toggle("is-scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobilmenü ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var overlay = document.getElementById("menu");
  if (toggle && overlay) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
      overlay.classList.toggle("is-open", open);
      overlay.setAttribute("aria-hidden", String(!open));
      document.body.classList.toggle("menu-open", open);
    });
    overlay.addEventListener("click", function (e) {
      if (e.target.closest("a")) toggle.click();
    });
  }

  /* ---------- Reveal beim Scrollen ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  var bars = document.querySelectorAll(".milestone-bar");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
    bars.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
    bars.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Zähler ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window && !reduceMotion) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        cio.unobserve(entry.target);
        var el = entry.target;
        var target = parseInt(el.getAttribute("data-count"), 10) || 0;
        var t0 = performance.now();
        var tick = function (t) {
          var p = Math.min((t - t0) / 900, 1);
          el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: .6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Vorher/Nachher-Regler ---------- */
  document.querySelectorAll("[data-compare]").forEach(function (cmp) {
    var setPos = function (pct) {
      pct = Math.max(0, Math.min(100, pct));
      cmp.style.setProperty("--pos", pct + "%");
      cmp.setAttribute("aria-valuenow", String(Math.round(pct)));
    };
    var fromEvent = function (e) {
      var rect = cmp.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      setPos((x / rect.width) * 100);
    };
    var dragging = false;
    cmp.addEventListener("pointerdown", function (e) {
      dragging = true;
      cmp.setPointerCapture(e.pointerId);
      fromEvent(e);
    });
    cmp.addEventListener("pointermove", function (e) { if (dragging) fromEvent(e); });
    cmp.addEventListener("pointerup", function () { dragging = false; });
    cmp.addEventListener("keydown", function (e) {
      var now = parseFloat(cmp.getAttribute("aria-valuenow")) || 50;
      if (e.key === "ArrowLeft") { setPos(now - 5); e.preventDefault(); }
      if (e.key === "ArrowRight") { setPos(now + 5); e.preventDefault(); }
    });
  });

  /* ---------- Link kopieren (Referenzseiten) ---------- */
  document.querySelectorAll("[data-copy-link]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      navigator.clipboard.writeText(location.href).then(function () {
        var label = btn.textContent;
        btn.textContent = "Kopiert ✓";
        setTimeout(function () { btn.textContent = label; }, 2000);
      });
    });
  });

  /* ---------- Bauanfrage-Formular ---------- */
  document.querySelectorAll("[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll("[required]").forEach(function (input) {
        var field = input.closest(".field");
        var ok = input.type === "checkbox" ? input.checked : input.checkValidity();
        if (field) field.classList.toggle("is-invalid", !ok);
        if (!ok) valid = false;
      });
      if (!valid) {
        var first = form.querySelector(".field.is-invalid input, .field.is-invalid select, .field.is-invalid textarea");
        if (first) first.focus();
        return;
      }
      var endpoint = form.getAttribute("data-endpoint");
      var done = function () {
        form.classList.add("is-sent");
        var success = form.querySelector(".form__success");
        if (success) success.focus();
      };
      if (endpoint) {
        fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
          .then(function (res) { if (!res.ok) throw new Error(res.status); done(); })
          .catch(function () {
            var err = form.querySelector(".form__error");
            if (err) err.hidden = false;
          });
      } else {
        /* Noch kein Backend-Endpoint: Anfrage als E-Mail-Entwurf öffnen. */
        var data = new FormData(form);
        var lines = [];
        data.forEach(function (value, key) { if (value && key !== "consent") lines.push(key + ": " + value); });
        location.href = "mailto:info@planvoller.de?subject=" +
          encodeURIComponent("Bauanfrage über planvoller.de") +
          "&body=" + encodeURIComponent(lines.join("\n"));
        done();
      }
    });
    form.querySelectorAll("input, select, textarea").forEach(function (input) {
      input.addEventListener("input", function () {
        var field = input.closest(".field");
        if (field) field.classList.remove("is-invalid");
      });
    });
  });

  /* ---------- Loop-Videos: nur sichtbar abspielen, Reduced-Motion respektieren ---------- */
  var loopVideos = document.querySelectorAll("video[autoplay]");
  if (loopVideos.length) {
    if (reduceMotion) {
      loopVideos.forEach(function (v) { v.removeAttribute("autoplay"); v.pause(); });
    } else if ("IntersectionObserver" in window) {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var v = entry.target;
          var once = !v.hasAttribute("loop");
          if (once && v.ended) return;           /* auf letztem Bild stehen bleiben */
          if (document.documentElement.classList.contains("show-intro")) { v.pause(); return; }
          if (entry.isIntersecting) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
          else v.pause();
        });
      }, { threshold: .2 });
      loopVideos.forEach(function (v) { vio.observe(v); });
    }
  }

  /* ---------- Intro-Overlay (Startseite) ---------- */
  var intro = document.getElementById("pv-intro");
  if (intro && document.documentElement.classList.contains("show-intro")) {
    var introFrame = intro.querySelector("iframe");
    introFrame.src = introFrame.getAttribute("data-src");
    var heroVid = document.querySelector(".hero__bg video");
    if (heroVid) heroVid.pause();
    var introDone = false;
    var finishIntro = function () {
      if (introDone) return;
      introDone = true;
      try { sessionStorage.setItem("pvIntro", "1"); } catch (e) {}
      intro.classList.add("is-leaving");                 /* weicher Crossfade */
      document.documentElement.classList.remove("show-intro");
      window.scrollTo(0, 0);
      if (heroVid) {
        try { heroVid.currentTime = 0; } catch (e) {}
        var pr = heroVid.play();
        if (pr && pr.catch) pr.catch(function () {});
      }
      setTimeout(function () { intro.remove(); }, 1100);
    };
    window.addEventListener("message", function (e) {
      if (e && e.data && e.data.planvollerIntro === "done") finishIntro();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") finishIntro(); });
    introFrame.addEventListener("error", finishIntro);
    /* Wächter: läuft das Intro nicht nachweislich (gerenderter Canvas), automatisch überspringen */
    setTimeout(function () {
      if (introDone) return;
      var alive = false;
      try {
        var d = introFrame.contentDocument;
        var c = d && d.querySelector("canvas");
        var r = d && d.getElementById("root");
        alive = !!(c && c.width > 0 && r && r.childElementCount > 0);
      } catch (err) { alive = false; }
      if (!alive) finishIntro();
    }, 2500);
  } else if (intro) {
    intro.remove();
  }

  /* ---------- Kompetenz-Tabs ---------- */
  document.querySelectorAll(".tabs").forEach(function (tabs) {
    var tablist = tabs.querySelector('[role="tablist"]');
    if (!tablist) return;
    var tabsArr = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    var select = function (tab) {
      tabsArr.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
    };
    tablist.addEventListener("click", function (e) {
      var tab = e.target.closest('[role="tab"]');
      if (tab) select(tab);
    });
    tablist.addEventListener("keydown", function (e) {
      var i = tabsArr.indexOf(document.activeElement);
      if (i < 0) return;
      var n = i;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % tabsArr.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + tabsArr.length) % tabsArr.length;
      else if (e.key === "Home") n = 0;
      else if (e.key === "End") n = tabsArr.length - 1;
      else return;
      e.preventDefault();
      tabsArr[n].focus();
      select(tabsArr[n]);
    });
  });

  /* ---------- Jahreszahl im Footer ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
