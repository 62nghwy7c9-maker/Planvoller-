// houseStage — die gesamte Three.js-Szene des Hauses, entkoppelt von der
// Fortschritts-Quelle. Ein „Stage“ baut Renderer, Kamera, Ziegel, Fenster,
// Kamin und Schnee auf; per update(dt, progress, lookX, lookY) wird es auf
// einen Fortschritt 0..1 gesetzt und gerendert. So können sowohl die
// scroll-gesteuerte Seite als auch das zeitgesteuerte Website-Intro dieselbe
// Szene antreiben.
import * as THREE from 'three'

// ── Maße des Hauses ──────────────────────────────────────────────────────────
const HALF_W = 3
const HALF_D = 2.6
const WALL_H = 3.2
const GABLE_RISE = 1.7
const RIDGE_Y = WALL_H + GABLE_RISE
const BRICK_H = 0.32
const BRICK_LEN = 0.62
const WALL_THICK = 0.32
const DOOR_HALF_W = 0.75
const DOOR_H = 2.2
const DOOR_THETA = Math.PI / 2 // Tür zeigt Richtung +z

const ROOF_L = Math.hypot(HALF_W, GABLE_RISE)
const TILE_SLOPE = 0.5
const TILE_RIDGE = 0.56
const ROOF_THICK = 0.16
const ROOF_OVER_RIDGE = 0.35
const ROOF_OVER_EAVE = 0.3

const SNOW_COUNT = 1200
export const ASSEMBLY_END = 0.5 // Anteil des Fortschritts, nach dem das Haus steht

const BG = new THREE.Color('#e9eef2')

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
export const smoothstep = (t: number) => t * t * (3 - 2 * t)

type Keyframe = { s: number; r: number; th: number; h: number; ty: number; tz: number }

// Kamerafahrt: weit draußen → Umrundung → frontal vor die Tür → durch die Tür
const CAM_PATH: Keyframe[] = [
  { s: 0.0, r: 17.0, th: DOOR_THETA + 0.85, h: 6.5, ty: 2.4, tz: 0 },
  { s: 0.22, r: 12.0, th: DOOR_THETA + 0.4, h: 4.2, ty: 2.1, tz: 0 },
  { s: 0.45, r: 9.0, th: DOOR_THETA - 0.32, h: 2.8, ty: 1.8, tz: 0 },
  { s: 0.64, r: 6.6, th: DOOR_THETA, h: 1.5, ty: 1.4, tz: 0 },
  { s: 0.82, r: 3.4, th: DOOR_THETA, h: 1.25, ty: 1.3, tz: -0.6 },
  { s: 1.0, r: 0.1, th: DOOR_THETA, h: 1.35, ty: 1.12, tz: -1.5 },
]

type Brick = {
  target: THREE.Vector3
  targetQuat: THREE.Quaternion
  scatter: THREE.Vector3
  scatterQuat: THREE.Quaternion
  scale: THREE.Vector3
  color: THREE.Color
  delayRaw: number
  delay: number
}

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type WallName = 'front' | 'back' | 'left' | 'right'
type WallDef = { C: THREE.Vector3; A: THREE.Vector3; N: THREE.Vector3; half: number }

const WALLS: Record<WallName, WallDef> = {
  front: { C: new THREE.Vector3(0, 0, HALF_D), A: new THREE.Vector3(1, 0, 0), N: new THREE.Vector3(0, 0, 1), half: HALF_W },
  back: { C: new THREE.Vector3(0, 0, -HALF_D), A: new THREE.Vector3(-1, 0, 0), N: new THREE.Vector3(0, 0, -1), half: HALF_W },
  left: { C: new THREE.Vector3(-HALF_W, 0, 0), A: new THREE.Vector3(0, 0, 1), N: new THREE.Vector3(-1, 0, 0), half: HALF_D },
  right: { C: new THREE.Vector3(HALF_W, 0, 0), A: new THREE.Vector3(0, 0, -1), N: new THREE.Vector3(1, 0, 0), half: HALF_D },
}

type Win = { wall: WallName; a: number; y: number; w: number; h: number }
const WINDOWS: Win[] = [
  { wall: 'left', a: -1.1, y: 1.6, w: 1.0, h: 1.15 },
  { wall: 'left', a: 1.1, y: 1.6, w: 1.0, h: 1.15 },
  { wall: 'right', a: -1.1, y: 1.6, w: 1.0, h: 1.15 },
  { wall: 'right', a: 1.1, y: 1.6, w: 1.0, h: 1.15 },
  { wall: 'back', a: -1.3, y: 1.7, w: 0.95, h: 1.05 },
  { wall: 'back', a: 1.3, y: 1.7, w: 0.95, h: 1.05 },
  { wall: 'front', a: -1.95, y: 1.7, w: 0.78, h: 0.9 },
  { wall: 'front', a: 1.95, y: 1.7, w: 0.78, h: 0.9 },
]

const UP = new THREE.Vector3(0, 1, 0)

function inWindow(wall: WallName, a: number, y: number) {
  for (const w of WINDOWS) {
    if (w.wall !== wall) continue
    if (Math.abs(a - w.a) < w.w / 2 + 0.05 && Math.abs(y - w.y) < w.h / 2 + 0.05) return true
  }
  return false
}

const wallColor = (rng: () => number) => new THREE.Color().setHSL(0.09, 0.28 + rng() * 0.07, 0.6 + rng() * 0.08)
const roofColor = (rng: () => number) => new THREE.Color().setHSL(0.6, 0.1 + rng() * 0.05, 0.4 + rng() * 0.06)
const chimneyColor = (rng: () => number) => new THREE.Color().setHSL(0.07, 0.25, 0.48 + rng() * 0.06)

function buildHouse(): Brick[] {
  const bricks: Brick[] = []
  const rng = mulberry32(20260710)

  const push = (
    target: THREE.Vector3,
    targetQuat: THREE.Quaternion,
    scale: THREE.Vector3,
    color: THREE.Color,
    delayRaw: number,
  ) => {
    const dir = new THREE.Vector3(rng() * 2 - 1, rng() * 1.4 + 0.2, rng() * 2 - 1).normalize()
    bricks.push({
      target: target.clone(),
      targetQuat: targetQuat.clone(),
      scatter: dir.multiplyScalar(11 + rng() * 7),
      scatterQuat: new THREE.Quaternion().setFromEuler(new THREE.Euler(rng() * 6.28, rng() * 6.28, rng() * 6.28)),
      scale,
      color,
      delayRaw,
      delay: 0,
    })
  }

  // Wände
  const courses = Math.round(WALL_H / BRICK_H)
  ;(Object.keys(WALLS) as WallName[]).forEach((name) => {
    const { C, A, N, half } = WALLS[name]
    const quat = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(A, UP, N))
    for (let c = 0; c < courses; c++) {
      const y = c * BRICK_H + BRICK_H / 2
      const offset = (c % 2) * (BRICK_LEN / 2)
      const nCol = Math.ceil((2 * half) / BRICK_LEN) + 1
      for (let i = -nCol; i <= nCol; i++) {
        const a = i * BRICK_LEN + offset
        if (Math.abs(a) > half) continue
        if (name === 'front' && Math.abs(a) < DOOR_HALF_W && y < DOOR_H) continue
        if (inWindow(name, a, y)) continue
        const pos = C.clone().addScaledVector(A, a).add(new THREE.Vector3(0, y, 0))
        push(pos, quat, new THREE.Vector3(BRICK_LEN * 0.96, BRICK_H * 0.92, WALL_THICK), wallColor(rng), y)
      }
    }
  })

  // Giebeldreiecke vorn und hinten
  for (const name of ['front', 'back'] as WallName[]) {
    const { C, A, N } = WALLS[name]
    const quat = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(A, UP, N))
    const gCourses = Math.ceil(GABLE_RISE / BRICK_H)
    for (let c = 0; c < gCourses; c++) {
      const y = WALL_H + c * BRICK_H + BRICK_H / 2
      const halfW = HALF_W * (1 - (y - WALL_H) / GABLE_RISE)
      if (halfW < BRICK_LEN * 0.5) continue
      const offset = (c % 2) * (BRICK_LEN / 2)
      const nCol = Math.ceil((2 * halfW) / BRICK_LEN) + 1
      for (let i = -nCol; i <= nCol; i++) {
        const a = i * BRICK_LEN + offset
        if (Math.abs(a) > halfW) continue
        const pos = C.clone().addScaledVector(A, a).add(new THREE.Vector3(0, y, 0))
        push(pos, quat, new THREE.Vector3(BRICK_LEN * 0.96, BRICK_H * 0.92, WALL_THICK), wallColor(rng), y)
      }
    }
  }

  // Giebeldach aus Dachziegeln
  const v = new THREE.Vector3(0, 0, 1)
  for (const side of [1, -1]) {
    const n = new THREE.Vector3((side * GABLE_RISE) / ROOF_L, HALF_W / ROOF_L, 0)
    const d = new THREE.Vector3((side * HALF_W) / ROOF_L, -GABLE_RISE / ROOF_L, 0)
    const lx = new THREE.Vector3().crossVectors(n, v)
    const quat = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(lx, n, v))
    const nSlope = Math.ceil((ROOF_L + ROOF_OVER_EAVE) / TILE_SLOPE)
    const zStart = -HALF_D - ROOF_OVER_RIDGE
    const zEnd = HALF_D + ROOF_OVER_RIDGE
    const nZ = Math.ceil((zEnd - zStart) / TILE_RIDGE)
    for (let si = 0; si < nSlope; si++) {
      const s = (si + 0.5) * TILE_SLOPE
      for (let zi = 0; zi <= nZ; zi++) {
        const z = zStart + zi * TILE_RIDGE
        const pos = new THREE.Vector3(0, RIDGE_Y, z).addScaledVector(d, s).addScaledVector(n, ROOF_THICK / 2 + 0.02)
        push(pos, quat, new THREE.Vector3(TILE_SLOPE * 1.05, ROOF_THICK, TILE_RIDGE * 1.05), roofColor(rng), RIDGE_Y + 0.5 + s)
      }
    }
  }

  // Schornstein
  const cx = HALF_W * 0.45
  const cz = -HALF_D * 0.35
  const baseY = RIDGE_Y - (cx / HALF_W) * GABLE_RISE
  const topY = RIDGE_Y + 1.0
  const identQuat = new THREE.Quaternion()
  let level = 0
  for (let y = baseY + BRICK_H / 2; y < topY; y += BRICK_H, level++) {
    push(new THREE.Vector3(cx, y, cz), identQuat, new THREE.Vector3(0.55, BRICK_H * 0.95, 0.55), chimneyColor(rng), RIDGE_Y + 3 + level * 0.05)
  }

  let maxRaw = 0
  for (const b of bricks) maxRaw = Math.max(maxRaw, b.delayRaw)
  for (const b of bricks) b.delay = (b.delayRaw / maxRaw) * 0.6 + rng() * 0.03

  return bricks
}

function makeShadowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 128)
  g.addColorStop(0, 'rgba(120, 138, 155, 0.42)')
  g.addColorStop(0.6, 'rgba(120, 138, 155, 0.16)')
  g.addColorStop(1, 'rgba(120, 138, 155, 0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export type HouseStage = {
  update(dt: number, progress: number, lookX: number, lookY: number): void
  resize(): void
  dispose(): void
}

export type HouseStageOptions = { snow?: boolean }

// Baut die komplette Szene in `mount` und liefert eine Steuerung zurück.
export function createHouseStage(mount: HTMLElement, opts: HouseStageOptions = {}): HouseStage {
  const withSnow = opts.snow !== false

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(mount.clientWidth, mount.clientHeight)
  mount.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  scene.background = BG
  scene.fog = new THREE.Fog(BG, 11, 30)

  const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 70)

  scene.add(new THREE.HemisphereLight(0xffffff, 0xd7e0e8, 1.05))
  const sun = new THREE.DirectionalLight(0xfff2e0, 1.5)
  sun.position.set(6, 9, 5)
  scene.add(sun)

  const ground = new THREE.Mesh(new THREE.CircleGeometry(46, 48), new THREE.MeshStandardMaterial({ color: 0xf3f7fa, roughness: 1 }))
  ground.rotation.x = -Math.PI / 2
  scene.add(ground)

  const shadowTex = makeShadowTexture()
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(5.4, 32),
    new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }),
  )
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = 0.01
  shadow.scale.set(1.15, 1, 1)
  scene.add(shadow)

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(2 * HALF_W - 0.25, 2 * HALF_D - 0.25),
    new THREE.MeshStandardMaterial({ color: 0x6f5334, roughness: 0.85 }),
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.y = 0.04
  scene.add(floor)

  const bricks = buildHouse()
  const brickGeo = new THREE.BoxGeometry(1, 1, 1)
  const brickMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.72, metalness: 0.02, flatShading: true })
  const instanced = new THREE.InstancedMesh(brickGeo, brickMat, bricks.length)
  instanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  for (let i = 0; i < bricks.length; i++) instanced.setColorAt(i, bricks[i].color)
  scene.add(instanced)

  const paneGroup = new THREE.Group()
  const panes: THREE.Mesh[] = []
  for (const w of WINDOWS) {
    const { C, A, N } = WALLS[w.wall]
    const quat = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(A, UP, N))
    const pos = C.clone().addScaledVector(A, w.a).add(new THREE.Vector3(0, w.y, 0)).addScaledVector(N, 0.05)
    const pane = new THREE.Mesh(
      new THREE.PlaneGeometry(w.w, w.h),
      new THREE.MeshBasicMaterial({ color: 0xffd08a, transparent: true, opacity: 0 }),
    )
    pane.position.copy(pos)
    pane.quaternion.copy(quat)
    pane.scale.setScalar(0.001)
    paneGroup.add(pane)
    panes.push(pane)
  }
  scene.add(paneGroup)

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.34, 1),
    new THREE.MeshStandardMaterial({ color: 0xffcf9e, emissive: 0xff7a24, emissiveIntensity: 1.9, roughness: 0.35, flatShading: true }),
  )
  core.position.set(0, 0.7, -1.4)
  core.scale.setScalar(0.0001)
  scene.add(core)

  const coreLight = new THREE.PointLight(0xffa54d, 0, 9, 2)
  coreLight.position.set(0, 1.0, -1.2)
  scene.add(coreLight)

  let snowGeo: THREE.BufferGeometry | null = null
  let snowSpeed: Float32Array | null = null
  let snow: THREE.Points | null = null
  if (withSnow) {
    snowGeo = new THREE.BufferGeometry()
    const snowPos = new Float32Array(SNOW_COUNT * 3)
    snowSpeed = new Float32Array(SNOW_COUNT)
    const srng = mulberry32(99)
    for (let i = 0; i < SNOW_COUNT; i++) {
      snowPos[i * 3] = (srng() - 0.5) * 26
      snowPos[i * 3 + 1] = srng() * 11
      snowPos[i * 3 + 2] = (srng() - 0.5) * 26
      snowSpeed[i] = 0.4 + srng() * 0.9
    }
    snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3))
    snow = new THREE.Points(
      snowGeo,
      new THREE.PointsMaterial({ color: 0xaac0d0, size: 0.05, transparent: true, opacity: 0.75, depthWrite: false }),
    )
    scene.add(snow)
  }

  // ── Update-Helfer ──────────────────────────────────────────────────────────
  const dummy = new THREE.Object3D()
  const tmpQuat = new THREE.Quaternion()
  const tmpPos = new THREE.Vector3()
  const look = new THREE.Vector3()
  let lastAssembly = -1

  const updateBricks = (p: number) => {
    if (Math.abs(p - lastAssembly) < 1e-5) return
    lastAssembly = p
    for (let i = 0; i < bricks.length; i++) {
      const b = bricks[i]
      const lp = clamp01((p - b.delay) / 0.33)
      const e = 1 - Math.pow(1 - lp, 3)
      tmpPos.lerpVectors(b.scatter, b.target, e)
      tmpQuat.slerpQuaternions(b.scatterQuat, b.targetQuat, e)
      dummy.position.copy(tmpPos)
      dummy.quaternion.copy(tmpQuat)
      dummy.scale.copy(b.scale).multiplyScalar(Math.max(e, 0.0001))
      dummy.updateMatrix()
      instanced.setMatrixAt(i, dummy.matrix)
    }
    instanced.instanceMatrix.needsUpdate = true
  }

  const placeCamera = (s: number, lookX: number, lookY: number) => {
    let a = CAM_PATH[0]
    let b = CAM_PATH[CAM_PATH.length - 1]
    for (let i = 0; i < CAM_PATH.length - 1; i++) {
      if (s >= CAM_PATH[i].s && s <= CAM_PATH[i + 1].s) {
        a = CAM_PATH[i]
        b = CAM_PATH[i + 1]
        break
      }
    }
    const t = b.s === a.s ? 0 : smoothstep(clamp01((s - a.s) / (b.s - a.s)))
    const r = THREE.MathUtils.lerp(a.r, b.r, t)
    const th = THREE.MathUtils.lerp(a.th, b.th, t)
    const h = THREE.MathUtils.lerp(a.h, b.h, t)
    camera.position.set(r * Math.cos(th), h, r * Math.sin(th))
    look.set(lookX * 0.35, THREE.MathUtils.lerp(a.ty, b.ty, t) - lookY * 0.22, THREE.MathUtils.lerp(a.tz, b.tz, t))
    camera.lookAt(look)
  }

  return {
    update(dt, progress, lookX, lookY) {
      updateBricks(clamp01(progress / ASSEMBLY_END))
      placeCamera(progress, lookX, lookY)

      const winT = smoothstep(clamp01((progress - 0.5) / 0.18))
      for (const pane of panes) {
        pane.scale.setScalar(Math.max(winT, 0.001))
        ;(pane.material as THREE.MeshBasicMaterial).opacity = winT * 0.95
      }

      const coreT = smoothstep(clamp01((progress - 0.68) / 0.24))
      core.scale.setScalar(Math.max(coreT, 0.0001))
      core.rotation.y += dt * 0.5
      coreLight.intensity = coreT * 22

      if (snow && snowGeo && snowSpeed) {
        const pos = snowGeo.attributes.position as THREE.BufferAttribute
        for (let i = 0; i < SNOW_COUNT; i++) {
          let y = pos.getY(i) - snowSpeed[i] * dt
          if (y < 0) y = 11
          pos.setY(i, y)
          pos.setX(i, pos.getX(i) + Math.sin(y * 2 + i) * dt * 0.12)
        }
        pos.needsUpdate = true
      }

      renderer.render(scene, camera)
    },
    resize() {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    },
    dispose() {
      mount.removeChild(renderer.domElement)
      renderer.dispose()
      brickGeo.dispose()
      brickMat.dispose()
      ground.geometry.dispose()
      ;(ground.material as THREE.Material).dispose()
      floor.geometry.dispose()
      ;(floor.material as THREE.Material).dispose()
      shadow.geometry.dispose()
      ;(shadow.material as THREE.Material).dispose()
      shadowTex.dispose()
      core.geometry.dispose()
      ;(core.material as THREE.Material).dispose()
      for (const pane of panes) {
        pane.geometry.dispose()
        ;(pane.material as THREE.Material).dispose()
      }
      if (snow && snowGeo) {
        snowGeo.dispose()
        ;(snow.material as THREE.Material).dispose()
      }
    },
  }
}
