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
  const camEnd = new THREE.Vector3(6.2, 2.6, 8.6);
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

  /* Baukörper (angelehnt an den Kubus-Typus der Referenzen).
     dropY klein genug, dass das schwebende Drahtmodell beim Laden im Bild ist. */
  part(2.6, 2.6, 2.3, -1.15, 0.1, CONCRETE.clone().lerp(PAPER, 0.35), 1.9, 0); // Putz-Volumen
  part(2.3, 3.1, 2.5, 1.15, -0.15, INK.clone().lerp(CONCRETE, 0.25), 2.6, 1); // Anthrazit-Volumen
  part(2.7, 0.14, 2.9, 1.15, -0.15, INK, 3.2, 2);                             // Dachplatte
  parts[2].userData.finalY = 3.1 + 0.07;
  parts[2].position.y = parts[2].userData.finalY;
  part(1.5, 0.12, 1.6, -0.1, 1.35, SAND, 1.6, 3);                             // Vordach (Holz)
  parts[3].userData.finalY = 2.25;
  parts[3].position.y = 2.25;

  /* Fensterflächen — leuchten am Ende warm auf */
  const winMat = new THREE.MeshBasicMaterial({
    color: 0xe8a13f, transparent: true, opacity: 0
  });
  const windows = [];
  function win(w, h, x, y, z) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), winMat);
    m.position.set(x, y, z);
    house.add(m);
    windows.push(m);
  }
  win(1.5, 1.7, -1.15, 1.25, 1.262); // großes Fenster Volumen A
  win(0.9, 1.1, 1.0, 1.0, 1.11);     // EG Volumen B
  win(1.3, 0.8, 1.15, 2.45, 1.11);   // OG-Band Volumen B

  /* Akzent: die eine Fuge zwischen den Volumen */
  const seam = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 2.6, 0.05),
    new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0 })
  );
  seam.position.set(0.12, 1.3, 1.2);
  house.add(seam);

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

    /* 3) Licht an (.65 → 1) */
    const glow = easeIO(phase(p, 0.65, 0.95));
    winMat.opacity = glow * 0.95;
    warm.intensity = glow * 2.4;
    sun.color.setHex(0xdfe3e8).lerp(new THREE.Color(0xffd9ae), glow);
    seam.material.opacity = easeIO(phase(p, 0.5, 0.7)) * 0.9;

    /* Kamera: ruhige Annäherung + Maus-Parallax + minimale Atmung */
    mx += (tx - mx) * 0.04;
    const cp = easeIO(phase(p, 0.15, 1));
    camera.position.lerpVectors(camStart, camEnd, cp);
    const swing = mx + Math.sin(t * 0.22) * 0.015;
    camera.position.x = camera.position.x * Math.cos(swing) + camera.position.z * Math.sin(swing) * 0.35;
    camera.lookAt(0, 1.1 + 0.3 * cp, 0);

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
