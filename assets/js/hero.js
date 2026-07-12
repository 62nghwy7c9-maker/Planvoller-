/* ============================================================
   PLANVOLLER — WebGL-Hero: „Das Fügen"
   Zwei Baukörper schweben als Kanten-Drahtmodell über dem Grund
   und setzen sich beim Scrollen wie Kranmodule. Flächen
   materialisieren (Beton/Anthrazit), zuletzt geht warmes Licht
   in den Fenstern an.
   Degradiert: läuft nur bei Desktop + WebGL + Motion-Erlaubnis;
   sonst bleibt das Poster (after.jpg) stehen.
   ============================================================ */
import * as THREE from "three";

const docEl = document.documentElement;
const host = document.getElementById("hero-canvas");
const heroSection = document.querySelector(".hero");

const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const DESKTOP = matchMedia("(min-width: 900px)").matches;

if (host && heroSection && !REDUCED && DESKTOP && window.gsap && webglOK()) {
  init();
}

function webglOK() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext &&
      (c.getContext("webgl2") || c.getContext("webgl")));
  } catch (e) { return false; }
}

function cssColor(name) {
  return new THREE.Color(
    getComputedStyle(docEl).getPropertyValue(name).trim() || "#ccc"
  );
}

function init() {
  if (window.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);

  const PAPER = cssColor("--paper");
  const INK = cssColor("--ink");
  const CONCRETE = cssColor("--concrete");
  const SAND = cssColor("--sand");
  const ACCENT = cssColor("--accent");

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.setSize(host.clientWidth, host.clientHeight);
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(PAPER, 14, 30);

  const camera = new THREE.PerspectiveCamera(
    32, host.clientWidth / host.clientHeight, 0.1, 60
  );
  const camStart = new THREE.Vector3(7.5, 4.2, 10.5);
  const camEnd = new THREE.Vector3(8.0, 3.6, 11.0);
  camera.position.copy(camStart);
  camera.lookAt(0, 1.2, 0);

  /* Licht: kühl → warm */
  const hemi = new THREE.HemisphereLight(PAPER, CONCRETE, 1.35);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xdfe3e8, 1.1);
  sun.position.set(6, 9, 4);
  scene.add(sun);
  const warm = new THREE.PointLight(0xe8a13f, 0, 14, 1.8); // Fensterlicht
  warm.position.set(0.6, 1.4, 1.4);
  scene.add(warm);

  /* Grund */
  /* Unbeleuchteter Papier-Boden: verschmilzt mit dem Seitenhintergrund,
     das Planraster liefert die räumliche Referenz. */
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    new THREE.MeshBasicMaterial({ color: PAPER })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  const grid = new THREE.GridHelper(40, 40, INK, INK);
  grid.material.transparent = true;
  grid.material.opacity = 0.06;
  grid.position.y = 0.001;
  scene.add(grid);

  const house = new THREE.Group();
  scene.add(house);

  /* Bauteil: Volumen + Kantenmodell. dropFrom = Fügungs-Offset */
  const parts = [];
  function part(w, h, d, x, z, color, dropY, order) {
    const g = new THREE.Group();
    const geo = new THREE.BoxGeometry(w, h, d);
    const mat = new THREE.MeshStandardMaterial({
      color, roughness: 0.92, metalness: 0,
      transparent: true, opacity: 0
    });
    const mesh = new THREE.Mesh(geo, mat);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0 })
    );
    g.add(mesh, edges);
    g.position.set(x, h / 2, z);
    g.userData = { finalY: h / 2, dropY, order, mat, lineMat: edges.material };
    house.add(g);
    parts.push(g);
    return g;
  }

  /* Baukörper — Kubus-Typus der Referenzen, architektonisch detailliert.
     dropY klein genug, dass das schwebende Drahtmodell beim Laden im Bild ist. */
  const PUTZ = CONCRETE.clone().lerp(PAPER, 0.4);
  const ANTHRAZIT = INK.clone().lerp(CONCRETE, 0.22);

  const volA = part(2.6, 2.6, 2.3, -1.15, 0.1, PUTZ, 1.9, 0);       // Putz-Volumen
  const volB = part(2.3, 3.34, 2.5, 1.15, -0.15, ANTHRAZIT, 2.6, 1);// Anthrazit-Volumen
  const roof = part(2.62, 0.16, 2.82, 1.15, -0.15, INK, 3.2, 2);    // Dachplatte + Attika
  roof.userData.finalY = 3.34 + 0.08;
  roof.position.y = roof.userData.finalY;
  const roofA = part(2.9, 0.12, 2.6, -1.2, 0.1, INK, 2.9, 2);       // Dachplatte Volumen A
  roofA.userData.finalY = 2.6 + 0.06;
  roofA.position.y = roofA.userData.finalY;
  const canopy = part(1.6, 0.1, 1.5, 0.05, 1.3, SAND, 1.6, 3);      // Vordach (Holz)
  canopy.userData.finalY = 2.3;
  canopy.position.y = 2.3;
  const garage = part(1.7, 1.15, 2.0, 2.95, 0.15, PUTZ.clone().lerp(SAND, 0.35), 1.3, 3); // Garagen-Volumen
  const plinth = part(4.7, 0.09, 2.85, 0.05, 0, INK.clone().lerp(CONCRETE, 0.4), 1.0, 0); // Sockel
  plinth.userData.finalY = 0.045;
  plinth.position.y = plinth.userData.finalY;

  /* Fenster: dunkle Laibungsrahmen + Glasflächen, die am Ende warm leuchten */
  const winMat = new THREE.MeshBasicMaterial({
    color: 0xe8a13f, transparent: true, opacity: 0
  });
  const frameMat = new THREE.MeshStandardMaterial({
    color: INK, roughness: 0.6, transparent: true, opacity: 0
  });

  function windowUnit(parent, w, h, x, y, z, mullions) {
    const g = new THREE.Group();
    const t = 0.06, d = 0.1;
    [[0, h / 2 + t / 2, w + 2 * t, t], [0, -h / 2 - t / 2, w + 2 * t, t]].forEach(function (r) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(r[2], r[3], d), frameMat);
      bar.position.set(r[0], r[1], 0);
      g.add(bar);
    });
    [[-w / 2 - t / 2, 0], [w / 2 + t / 2, 0]].forEach(function (r) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(t, h, d), frameMat);
      bar.position.set(r[0], r[1], 0);
      g.add(bar);
    });
    for (let i = 1; i <= (mullions || 0); i++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.035, h, d * 0.8), frameMat);
      bar.position.set(-w / 2 + (w / (mullions + 1)) * i, 0, 0);
      g.add(bar);
    }
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(w, h), winMat);
    glass.position.z = -0.01;
    g.add(glass);
    g.position.set(x, y, z);
    parent.add(g);
  }

  /* Fassaden-Öffnungen (lokal zu den Volumen → fügen sich mit) */
  windowUnit(volA, 1.5, 1.7, 0, -0.05, 1.16, 2);   // raumhohe Front Volumen A
  windowUnit(volA, 0.8, 0.9, 1.16, 0.35, 0, 0);    // Seitenfenster A (Ostfassade)
  volA.children[volA.children.length - 1].rotation.y = Math.PI / 2;
  windowUnit(volB, 0.95, 1.15, -0.35, -0.75, 1.26, 1); // EG Volumen B
  windowUnit(volB, 1.5, 0.85, 0.1, 0.85, 1.26, 2);     // OG-Band Volumen B
  windowUnit(garage, 1.2, 0.35, 0, 0.22, 1.01, 2);     // Garagen-Lichtband

  /* Akzent: die eine Fuge zwischen den Volumen */
  const seam = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 2.6, 0.05),
    new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0 })
  );
  seam.position.set(0.12, 1.3, 1.2);
  house.add(seam);

  /* Kontaktschatten: weicher radialer Verlauf unter dem Haus */
  const shadowCanvas = document.createElement("canvas");
  shadowCanvas.width = shadowCanvas.height = 256;
  const sctx = shadowCanvas.getContext("2d");
  const grad = sctx.createRadialGradient(128, 128, 20, 128, 128, 126);
  grad.addColorStop(0, "rgba(23,24,26,0.34)");
  grad.addColorStop(1, "rgba(23,24,26,0)");
  sctx.fillStyle = grad;
  sctx.fillRect(0, 0, 256, 256);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(8.4, 5.6),
    new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(shadowCanvas),
      transparent: true, opacity: 0, depthWrite: false
    })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0.3, 0.004, 0);
  scene.add(shadow);

  /* Startzustand: Teile schweben über ihrer Position */
  parts.forEach((p) => {
    p.position.y = p.userData.finalY + p.userData.dropY;
    p.rotation.y = 0.12 * (p.userData.order % 2 ? -1 : 1);
  });

  /* Scroll-Choreografie (Scrub) — Fortschritt 0→1 über die Hero-Strecke */
  const state = { p: 0 };
  window.gsap.to(state, {
    p: 1,
    ease: "none",
    scrollTrigger: {
      trigger: heroSection,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.4
    }
  });

  const easeSnap = window.gsap.parseEase("expo.out");
  const easeIO = window.gsap.parseEase("power2.inOut");

  function phase(p, a, b) {
    return Math.min(1, Math.max(0, (p - a) / (b - a)));
  }

  const heroCopy = document.querySelector(".hero__content .shell");

  /* Maus-Parallax */
  let mx = 0, tx = 0;
  addEventListener("mousemove", (e) => {
    tx = (e.clientX / innerWidth - 0.5) * 0.16;
  }, { passive: true });

  let visible = true;
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; },
    { threshold: 0 }).observe(heroSection);

  const clock = new THREE.Clock();

  function render() {
    requestAnimationFrame(render);
    if (!visible) return;

    const t = clock.getElapsedTime();
    const p = state.p;

    /* 1) Fügen: Kanten sichtbar, Teile setzen sich gestaffelt (0 → .6) */
    parts.forEach((part) => {
      const d = part.userData;
      const local = easeSnap(phase(p, 0.04 + d.order * 0.07, 0.5 + d.order * 0.06));
      part.position.y = d.finalY + d.dropY * (1 - local);
      part.rotation.y = 0.12 * (d.order % 2 ? -1 : 1) * (1 - local);
      d.lineMat.opacity = 0.25 + 0.65 * phase(p, 0, 0.12);
      /* 2) Materialisieren (.35 → .75) */
      d.mat.opacity = easeIO(phase(p, 0.35, 0.75));
      /* Kanten treten zurück, sobald Material trägt */
      d.lineMat.opacity *= 1 - 0.75 * phase(p, 0.6, 0.9);
    });

    /* 2b) Details materialisieren mit den Flächen */
    const solid = easeIO(phase(p, 0.35, 0.75));
    frameMat.opacity = solid;
    shadow.material.opacity = solid * 0.85;

    /* 3) Licht an (.65 → 1) */
    const glow = easeIO(phase(p, 0.65, 0.95));
    winMat.opacity = glow * 0.95;
    warm.intensity = glow * 2.4;
    sun.color.setHex(0xdfe3e8).lerp(new THREE.Color(0xffd9ae), glow);
    seam.material.opacity = easeIO(phase(p, 0.5, 0.7)) * 0.9;

    /* 4) Hero-Text weicht dem Haus, „15/15" übernimmt */
    if (heroCopy) {
      const fade = 1 - easeIO(phase(p, 0.5, 0.72));
      heroCopy.style.opacity = fade;
      heroCopy.style.visibility = fade < 0.01 ? "hidden" : "";
    }
    docEl.classList.toggle("hero-done", p > 0.78);

    /* Kamera: ruhige Annäherung + Maus-Parallax + minimale Atmung */
    mx += (tx - mx) * 0.04;
    const cp = easeIO(phase(p, 0.15, 1));
    camera.position.lerpVectors(camStart, camEnd, cp);
    const swing = mx + Math.sin(t * 0.22) * 0.015;
    camera.position.x = camera.position.x * Math.cos(swing) + camera.position.z * Math.sin(swing) * 0.35;
    camera.lookAt(0, 1.1 + 0.55 * cp, 0);

    renderer.render(scene, camera);
  }

  docEl.classList.add("webgl");
  requestAnimationFrame(render);
  if (window.ScrollTrigger) window.ScrollTrigger.refresh();

  addEventListener("resize", () => {
    camera.aspect = host.clientWidth / host.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(host.clientWidth, host.clientHeight);
  }, { passive: true });
}
