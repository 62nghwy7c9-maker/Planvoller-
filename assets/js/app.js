/* ============================================================
   HouseDesign rebuild – AI house & room design tool
   Demo mode: stylized preview rendered locally on a canvas.
   AI mode:   real image-to-image generation via Google Gemini
              (user-provided API key, stored in localStorage).
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- Data ---------------- */

  var ROOM_TYPES = ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Dining Room", "Office"];

  var STYLES = {
    interior: [
      { type: "modern", label: "Modern", prompt: "modern interior, clean geometric lines, sleek furniture, glass and metal accents, neutral tones, minimal clutter" },
      { type: "minimalist", label: "Minimalist", prompt: "minimalist room, white walls, light wood furniture, uncluttered layout, neutral palette, simple shapes, soft natural light" },
      { type: "scandinavian", label: "Scandinavian", prompt: "Scandinavian style room, white walls, light wood, cozy textiles, soft neutral tones, simple shapes, bright daylight, hygge atmosphere" },
      { type: "industrial", label: "Industrial", prompt: "industrial loft, exposed concrete and brick walls, dark metal frames, rustic wood furniture, open layout, warehouse aesthetic, dramatic lighting" },
      { type: "rustic", label: "Rustic", prompt: "rustic room, natural wood beams, warm earthy tones, stone textures, cozy furniture, organic materials, soft lighting, simple layout" },
      { type: "bohemian", label: "Bohemian", prompt: "Boho room, rattan furniture, warm beige palette, one patterned rug, subtle bohemian accents, soft natural light, airy and relaxed" }
    ],
    exterior: [
      { type: "modern", label: "Modern", prompt: "modern aesthetic, focus on smooth facade textures, large-pane glass effects, neutral color palette (charcoal, white, grey), minimalist surface detailing, contemporary cladding materials like zinc or smooth stucco, matte finishes" },
      { type: "contemporary", label: "Contemporary", prompt: "contemporary design language, high-contrast mixed materials, integration of natural wood slats and stone veneer, expansive glass transparency, bold textural contrasts, sleek metallic accents, sophisticated architectural finishes" },
      { type: "farmhouse", label: "Farmhouse", prompt: "modern farmhouse aesthetic, white board-and-batten siding textures, matte black metal roofing finish, reclaimed wood accents on existing porch/trim, rustic yet clean textures, traditional country color palette, warm inviting material finishes" },
      { type: "colonial", label: "Colonial", prompt: "classic colonial finishes, traditional brickwork or horizontal siding textures, crisp white trim detailing, shutter textures applied to existing windows, formal and symmetrical color schemes, elegant historical material palette" },
      { type: "mediterranean", label: "Mediterranean", prompt: "Mediterranean coastal aesthetic, textured warm-tone stucco, terracotta clay tile textures for the existing roof, wrought iron detailing for window frames and railings, sun-drenched earth tones, smooth plaster finishes" },
      { type: "zen", label: "Zen", prompt: "Zen-inspired minimalist exterior, natural cedar or bamboo wood cladding, dark slate or stone textures, organic material palette, rhythmic vertical timber slats, serene and muted tones, minimalist landscaping textures" }
    ]
  };

  /* Per-style palette used for thumbnails and the demo color grade. */
  var STYLE_LOOK = {
    modern:        { a: "#4b5563", b: "#cfd6dd", tint: "rgba(70,90,110,0.18)",   filter: "contrast(1.12) saturate(0.85) brightness(1.03)" },
    minimalist:    { a: "#d6cfc2", b: "#f3efe8", tint: "rgba(255,250,240,0.22)", filter: "brightness(1.12) saturate(0.72) contrast(1.02)" },
    scandinavian:  { a: "#c9b79a", b: "#eef1f4", tint: "rgba(255,244,224,0.20)", filter: "brightness(1.1) saturate(0.9) contrast(1.03)" },
    industrial:    { a: "#54453d", b: "#8f857e", tint: "rgba(50,40,35,0.24)",    filter: "contrast(1.2) saturate(0.7) brightness(0.92)" },
    rustic:        { a: "#7a5233", b: "#c9a678", tint: "rgba(150,95,40,0.20)",   filter: "sepia(0.28) saturate(1.1) contrast(1.06)" },
    bohemian:      { a: "#b0713b", b: "#e2c49a", tint: "rgba(215,150,70,0.18)",  filter: "sepia(0.18) saturate(1.25) brightness(1.05)" },
    contemporary:  { a: "#37505c", b: "#c8b78f", tint: "rgba(60,90,105,0.16)",   filter: "contrast(1.14) saturate(1.05)" },
    farmhouse:     { a: "#3f3f3f", b: "#f2f0ea", tint: "rgba(255,255,250,0.18)", filter: "brightness(1.08) saturate(0.88) contrast(1.06)" },
    colonial:      { a: "#8c3b2e", b: "#e9e2d4", tint: "rgba(140,60,45,0.14)",   filter: "saturate(1.08) contrast(1.08)" },
    mediterranean: { a: "#c96f3b", b: "#f0d9b6", tint: "rgba(230,140,60,0.20)",  filter: "sepia(0.2) saturate(1.28) brightness(1.06)" },
    zen:           { a: "#4d5a4a", b: "#b7a98d", tint: "rgba(70,90,70,0.18)",    filter: "saturate(0.85) contrast(1.08) brightness(0.98)" }
  };

  var LOADING_MSGS = [
    "Analyzing your photo…",
    "Detecting structure and layout…",
    "Applying the selected style…",
    "Rendering your new design…"
  ];

  var KEY_STORAGE = "housedesign.geminiKey";
  var HISTORY_STORAGE = "housedesign.history";

  /* ---------------- State ---------------- */

  var state = {
    designType: "interior",
    roomType: ROOM_TYPES[0],
    styleType: "modern",
    image: null,        // dataURL of the uploaded photo
    generating: false
  };

  /* ---------------- DOM ---------------- */

  var $ = function (id) { return document.getElementById(id); };
  var dropzone = $("dropzone"), fileInput = $("file-input");
  var designBtn = $("design-btn");
  var styleGrid = $("style-grid"), roomRow = $("room-type-row"), roomBlock = $("room-type-block");

  /* ---------------- Thumbnails (generated SVG, no external assets) ---------------- */

  function styleThumb(style, designType) {
    var look = STYLE_LOOK[style.type];
    var glyph = designType === "exterior"
      ? '<path d="M30 62 60 38l30 24" stroke="#ffffff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<rect x="40" y="58" width="40" height="26" fill="#ffffff" opacity="0.9" rx="2"/>' +
        '<rect x="55" y="68" width="10" height="16" fill="' + look.a + '"/>'
      : '<rect x="30" y="58" width="34" height="16" rx="4" fill="#ffffff" opacity="0.92"/>' +
        '<rect x="32" y="50" width="8" height="14" rx="2" fill="#ffffff" opacity="0.92"/>' +
        '<rect x="72" y="42" width="18" height="32" rx="2" fill="#ffffff" opacity="0.75"/>' +
        '<circle cx="46" cy="36" r="7" fill="#ffffff" opacity="0.85"/>';
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + look.b + '"/><stop offset="1" stop-color="' + look.a + '"/>' +
      '</linearGradient></defs>' +
      '<rect width="120" height="90" fill="url(#g)"/>' + glyph + "</svg>";
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  /* ---------------- Controls rendering ---------------- */

  function renderRoomTypes() {
    roomRow.innerHTML = "";
    ROOM_TYPES.forEach(function (rt) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (rt === state.roomType ? " active" : "");
      b.textContent = rt;
      b.addEventListener("click", function () {
        state.roomType = rt;
        renderRoomTypes();
      });
      roomRow.appendChild(b);
    });
  }

  function renderStyles() {
    styleGrid.innerHTML = "";
    STYLES[state.designType].forEach(function (st) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "style-item" + (st.type === state.styleType ? " active" : "");
      var img = document.createElement("img");
      img.src = styleThumb(st, state.designType);
      img.alt = st.label + " style";
      var span = document.createElement("span");
      span.textContent = st.label;
      b.appendChild(img);
      b.appendChild(span);
      b.addEventListener("click", function () {
        state.styleType = st.type;
        renderStyles();
      });
      styleGrid.appendChild(b);
    });
  }

  document.querySelectorAll(".seg-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      state.designType = btn.dataset.designType;
      document.querySelectorAll(".seg-btn").forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("active", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });
      roomBlock.style.display = state.designType === "interior" ? "" : "none";
      if (!STYLES[state.designType].some(function (s) { return s.type === state.styleType; })) {
        state.styleType = STYLES[state.designType][0].type;
      }
      renderStyles();
    });
  });

  /* ---------------- Upload (click / drag&drop / paste) ---------------- */

  function setImage(dataUrl) {
    state.image = dataUrl;
    $("dz-preview-img").src = dataUrl;
    $("dz-preview").hidden = !dataUrl;
    $("dz-placeholder").style.display = dataUrl ? "none" : "";
    updateDesignBtn();
  }

  function readFile(file) {
    if (!file || file.type.indexOf("image/") !== 0) {
      toast("Please choose an image file.");
      return;
    }
    var reader = new FileReader();
    reader.onload = function () { setImage(reader.result); };
    reader.readAsDataURL(file);
  }

  dropzone.addEventListener("click", function (e) {
    if (e.target.id === "dz-remove") return;
    fileInput.click();
  });
  dropzone.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); }
  });
  fileInput.addEventListener("change", function () { readFile(fileInput.files[0]); fileInput.value = ""; });

  ["dragover", "dragenter"].forEach(function (ev) {
    dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("dragover"); });
  });
  ["dragleave", "drop"].forEach(function (ev) {
    dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove("dragover"); });
  });
  dropzone.addEventListener("drop", function (e) {
    readFile(e.dataTransfer.files[0]);
  });
  document.addEventListener("paste", function (e) {
    var items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    for (var i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image/") === 0) { readFile(items[i].getAsFile()); break; }
    }
  });
  $("dz-remove").addEventListener("click", function (e) {
    e.stopPropagation();
    setImage(null);
  });

  function updateDesignBtn() {
    designBtn.disabled = !state.image || state.generating;
  }

  /* ---------------- Prompt composition ---------------- */

  function currentStyle() {
    var list = STYLES[state.designType];
    for (var i = 0; i < list.length; i++) if (list[i].type === state.styleType) return list[i];
    return list[0];
  }

  function buildPrompt() {
    var st = currentStyle();
    if (state.designType === "interior") {
      return "Redesign this " + state.roomType.toLowerCase() +
        " in the uploaded photo. Keep the room's architectural structure, walls, windows, doors and camera perspective exactly as in the original. Apply this interior style: " +
        st.prompt + ". Photorealistic interior render, natural lighting, high detail.";
    }
    return "Redesign the exterior of the house in the uploaded photo. Keep the building's structure, proportions, window and door positions and camera perspective exactly as in the original. Apply this exterior style: " +
      st.prompt + ". Photorealistic architectural render, realistic daylight, high detail.";
  }

  /* ---------------- Generation ---------------- */

  designBtn.addEventListener("click", function () {
    if (!state.image || state.generating) return;
    generate();
  });

  function generate() {
    state.generating = true;
    updateDesignBtn();
    $("result-placeholder").hidden = true;
    $("result-view").hidden = true;
    $("result-loading").hidden = false;

    var msgIdx = 0;
    $("loading-msg").textContent = LOADING_MSGS[0];
    var msgTimer = setInterval(function () {
      msgIdx = (msgIdx + 1) % LOADING_MSGS.length;
      $("loading-msg").textContent = LOADING_MSGS[msgIdx];
    }, 1600);

    var apiKey = localStorage.getItem(KEY_STORAGE);
    var run = apiKey ? generateWithGemini(apiKey) : generateDemo();

    run.then(function (resultDataUrl) {
      showResult(state.image, resultDataUrl);
      saveHistory(resultDataUrl);
    }).catch(function (err) {
      toast("Generation failed: " + (err && err.message ? err.message : err));
      $("result-placeholder").hidden = false;
    }).finally(function () {
      clearInterval(msgTimer);
      $("result-loading").hidden = true;
      state.generating = false;
      updateDesignBtn();
    });
  }

  /* Demo mode: local canvas color grade approximating the chosen style. */
  function generateDemo() {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () {
        try {
          var maxW = 1400;
          var scale = Math.min(1, maxW / img.naturalWidth);
          var w = Math.round(img.naturalWidth * scale);
          var h = Math.round(img.naturalHeight * scale);
          var c = document.createElement("canvas");
          c.width = w; c.height = h;
          var ctx = c.getContext("2d");
          var look = STYLE_LOOK[state.styleType] || STYLE_LOOK.modern;

          ctx.filter = look.filter;
          ctx.drawImage(img, 0, 0, w, h);
          ctx.filter = "none";

          // style tint
          ctx.fillStyle = look.tint;
          ctx.fillRect(0, 0, w, h);

          // soft vignette for a "rendered" feel
          var vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.45, w / 2, h / 2, Math.max(w, h) * 0.75);
          vg.addColorStop(0, "rgba(0,0,0,0)");
          vg.addColorStop(1, "rgba(0,0,0,0.22)");
          ctx.fillStyle = vg;
          ctx.fillRect(0, 0, w, h);

          // gentle warm light from the top
          var lg = ctx.createLinearGradient(0, 0, 0, h);
          lg.addColorStop(0, "rgba(255,240,210,0.10)");
          lg.addColorStop(0.5, "rgba(255,240,210,0)");
          ctx.fillStyle = lg;
          ctx.fillRect(0, 0, w, h);

          // simulate processing time
          setTimeout(function () { resolve(c.toDataURL("image/jpeg", 0.92)); }, 2400);
        } catch (e) { reject(e); }
      };
      img.onerror = function () { reject(new Error("Could not load the uploaded image.")); };
      img.src = state.image;
    });
  }

  /* AI mode: Gemini image-to-image generation. */
  function generateWithGemini(apiKey) {
    var m = /^data:(image\/[a-z+.-]+);base64,(.*)$/.exec(state.image);
    if (!m) return Promise.reject(new Error("Unsupported image format."));
    var body = {
      contents: [{
        parts: [
          { text: buildPrompt() },
          { inline_data: { mime_type: m[1], data: m[2] } }
        ]
      }]
    };
    var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=" +
      encodeURIComponent(apiKey);
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then(function (res) {
      if (!res.ok) {
        return res.json().catch(function () { return {}; }).then(function (e) {
          throw new Error((e.error && e.error.message) || ("HTTP " + res.status));
        });
      }
      return res.json();
    }).then(function (data) {
      var parts = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts || [];
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i].inlineData || parts[i].inline_data;
        if (p && p.data) return "data:" + (p.mimeType || p.mime_type || "image/png") + ";base64," + p.data;
      }
      throw new Error("The model returned no image.");
    });
  }

  /* ---------------- Result view ---------------- */

  var lastResult = null;

  function showResult(beforeUrl, afterUrl) {
    lastResult = afterUrl;
    $("result-before").src = beforeUrl;
    $("result-after").src = afterUrl;
    $("result-view").hidden = false;
    setComparePos($("result-compare"), $("result-after-wrap"), $("result-handle"), 50);
    $("result-area").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  $("download-btn").addEventListener("click", function () {
    if (!lastResult) return;
    var a = document.createElement("a");
    a.href = lastResult;
    a.download = "housedesign-" + state.designType + "-" + state.styleType + ".jpg";
    a.click();
  });

  $("again-btn").addEventListener("click", function () {
    $("result-view").hidden = true;
    $("result-placeholder").hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------------- Compare slider ---------------- */

  function setComparePos(container, afterWrap, handle, pct) {
    pct = Math.max(0, Math.min(100, pct));
    afterWrap.style.clipPath = "inset(0 0 0 " + pct + "%)";
    handle.style.left = pct + "%";
  }

  function initCompare(containerId, afterWrapId, handleId) {
    var container = $(containerId), afterWrap = $(afterWrapId), handle = $(handleId);
    if (!container) return;
    var dragging = false;
    function move(clientX) {
      var r = container.getBoundingClientRect();
      setComparePos(container, afterWrap, handle, ((clientX - r.left) / r.width) * 100);
    }
    container.addEventListener("pointerdown", function (e) {
      dragging = true;
      container.setPointerCapture(e.pointerId);
      move(e.clientX);
    });
    container.addEventListener("pointermove", function (e) { if (dragging) move(e.clientX); });
    ["pointerup", "pointercancel"].forEach(function (ev) {
      container.addEventListener(ev, function () { dragging = false; });
    });
  }

  initCompare("hero-compare", "hero-after-wrap", "hero-handle");
  initCompare("result-compare", "result-after-wrap", "result-handle");

  /* ---------------- History (localStorage) ---------------- */

  function loadHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_STORAGE)) || []; }
    catch (e) { return []; }
  }

  function saveHistory(resultUrl) {
    makeThumb(resultUrl, 200).then(function (thumb) {
      var items = loadHistory();
      items.unshift({
        thumb: thumb,
        designType: state.designType,
        roomType: state.designType === "interior" ? state.roomType : null,
        style: currentStyle().label,
        ts: Date.now()
      });
      items = items.slice(0, 24);
      try { localStorage.setItem(HISTORY_STORAGE, JSON.stringify(items)); }
      catch (e) { /* storage full – drop oldest and retry once */
        try { localStorage.setItem(HISTORY_STORAGE, JSON.stringify(items.slice(0, 8))); } catch (e2) {}
      }
      renderHistory();
    });
  }

  function makeThumb(dataUrl, width) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () {
        var c = document.createElement("canvas");
        var scale = width / img.naturalWidth;
        c.width = width;
        c.height = Math.round(img.naturalHeight * scale);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", 0.75));
      };
      img.onerror = function () { resolve(dataUrl); };
      img.src = dataUrl;
    });
  }

  function renderHistory() {
    var list = $("history-list");
    var items = loadHistory();
    if (!items.length) {
      list.innerHTML = '<p class="history-empty">No design history yet — your generated house and room designs will appear here after you start creating. ✨</p>';
      return;
    }
    list.innerHTML = "";
    items.forEach(function (it) {
      var div = document.createElement("div");
      div.className = "history-item";
      var img = document.createElement("img");
      img.src = it.thumb;
      img.alt = it.style + " design";
      var meta = document.createElement("div");
      var title = document.createElement("strong");
      title.textContent = it.style + " · " + (it.designType === "interior" ? (it.roomType || "Interior") : "Exterior");
      var when = document.createElement("small");
      when.textContent = new Date(it.ts).toLocaleString();
      meta.appendChild(title);
      meta.appendChild(when);
      div.appendChild(img);
      div.appendChild(meta);
      list.appendChild(div);
    });
  }

  var drawer = $("history-drawer"), backdrop = $("drawer-backdrop");
  $("history-btn").addEventListener("click", function () {
    renderHistory();
    drawer.hidden = false;
    backdrop.hidden = false;
  });
  function closeDrawer() { drawer.hidden = true; backdrop.hidden = true; }
  $("history-close").addEventListener("click", closeDrawer);
  backdrop.addEventListener("click", closeDrawer);

  /* ---------------- Settings modal ---------------- */

  var modal = $("settings-modal");
  function refreshModeNote() {
    var hasKey = !!localStorage.getItem(KEY_STORAGE);
    $("mode-note").innerHTML = hasKey
      ? 'AI mode active (Gemini). <button id="settings-btn" class="link-btn" type="button">Change API key</button>'
      : 'Demo mode – add a Gemini API key for real AI generation. <button id="settings-btn" class="link-btn" type="button">Set API key</button>';
    $("settings-btn").addEventListener("click", openSettings);
  }
  function openSettings() {
    $("api-key-input").value = localStorage.getItem(KEY_STORAGE) || "";
    modal.hidden = false;
  }
  $("settings-save").addEventListener("click", function () {
    var v = $("api-key-input").value.trim();
    if (v) {
      localStorage.setItem(KEY_STORAGE, v);
      toast("API key saved. AI mode is now active.");
    }
    modal.hidden = true;
    refreshModeNote();
  });
  $("settings-clear").addEventListener("click", function () {
    localStorage.removeItem(KEY_STORAGE);
    toast("API key removed. Back to demo mode.");
    modal.hidden = true;
    refreshModeNote();
  });
  $("settings-cancel").addEventListener("click", function () { modal.hidden = true; });
  modal.addEventListener("click", function (e) { if (e.target === modal) modal.hidden = true; });

  /* ---------------- Toast ---------------- */

  var toastTimer = null;
  function toast(msg) {
    var t = $("toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 3600);
  }

  /* ---------------- Smooth-scroll CTAs ---------------- */

  document.querySelectorAll(".scroll-tool").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  /* ---------------- Init ---------------- */

  renderRoomTypes();
  renderStyles();
  refreshModeNote();
  updateDesignBtn();
})();
