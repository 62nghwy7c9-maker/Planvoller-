// HouseIntro — wiederverwendbares Website-Intro.
// Spielt beim Einbinden automatisch ab (zeitgesteuert): das Haus baut sich auf,
// die Kamera fährt durch die Tür zum Kamin. Am Ende blendet das Intro weich aus
// und ruft onComplete() auf — dort blendest du deine eigentliche Seite ein.
//
// Einbauen:
//   const [intro, setIntro] = useState(true)
//   {intro && <HouseIntro onComplete={() => setIntro(false)} />}
//   … deine Website …
//
// Kopieren genügt: src/houseStage.ts + src/intro/HouseIntro.tsx + HouseIntro.css.
// Einzige Abhängigkeit: three.
import { useEffect, useRef } from 'react'
import { createHouseStage, clamp01, smoothstep } from '../houseStage'
import './HouseIntro.css'

export type HouseIntroProps = {
  /** Wird aufgerufen, sobald das Intro fertig ausgeblendet ist. */
  onComplete?: () => void
  /** Spieldauer der Fahrt in ms (ohne Ausblenden). Standard 7000. */
  duration?: number
  /** Markenname oben links und im ersten Titel. Standard „Haus“. */
  brand?: string
  /** Schlusszeile beim Betreten. Standard „Willkommen“. */
  headline?: string
  /** Text des Überspringen-Buttons. Leer/`null` blendet ihn aus. */
  skipLabel?: string | null
}

type Caption = { mid: number; width: number; eyebrow?: string; title: string; text?: string; hero?: boolean }

const HOLD_MS = 700 // Standbild am Ende, bevor ausgeblendet wird
const FADE_MS = 850 // Dauer des Ausblendens
const SKIP_MS = 1100 // Zeit, in der „Überspringen“ zum Ende fährt

export default function HouseIntro({
  onComplete,
  duration = 7000,
  brand = 'Haus',
  headline = 'Willkommen',
  skipLabel = 'Überspringen',
}: HouseIntroProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const capRefs = useRef<(HTMLDivElement | null)[]>([])
  const skipRef = useRef<() => void>(() => {})

  const captions: Caption[] = [
    { mid: 0.08, width: 0.13, title: brand, hero: true, text: 'Einen Moment …' },
    { mid: 0.5, width: 0.13, eyebrow: 'Stein auf Stein', title: 'Ein Zuhause entsteht.' },
    { mid: 0.95, width: 0.12, eyebrow: headline, title: 'Tritt ein.' },
  ]

  useEffect(() => {
    const root = rootRef.current
    const mount = canvasRef.current
    if (!root || !mount) return

    const reduceMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.getAttribute('data-motion') === 'reduziert'

    const stage = createHouseStage(mount, { snow: !reduceMotion })
    stage.resize()

    const onResize = () => stage.resize()
    window.addEventListener('resize', onResize)

    // Maus-Parallaxe (bei reduzierter Bewegung aus)
    const mouse = { x: 0, y: 0, sx: 0, sy: 0 }
    const onMouse = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    if (!reduceMotion) window.addEventListener('mousemove', onMouse, { passive: true })

    // Zeitleiste: linearer Fortschritt 0..1, danach halten, ausblenden, fertig.
    let linear = reduceMotion ? 1 : 0
    let phase: 'play' | 'hold' | 'fade' | 'done' = 'play'
    let holdT = 0
    let fadeT = 0
    let skipping = false
    let finished = false

    const finish = () => {
      if (finished) return
      finished = true
      onComplete?.()
    }

    skipRef.current = () => {
      if (phase === 'play') skipping = true
      else phase = 'fade' // schon am Ende → sofort ausblenden
    }

    const updateCaptions = (s: number) => {
      captions.forEach((cap, i) => {
        const el = capRefs.current[i]
        if (!el) return
        const o = clamp01(1 - Math.abs(s - cap.mid) / cap.width)
        el.style.opacity = String(o)
        el.style.transform = `translateY(${(1 - o) * 16}px)`
        el.style.visibility = o <= 0.01 ? 'hidden' : 'visible'
      })
    }

    let raf = 0
    let prev = performance.now()
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      // Zeitleiste läuft über echte Wanduhr-Zeit (rawMs), damit das Intro immer
      // in `duration` fertig wird — unabhängig von der Bildrate. Für Schnee und
      // Rotation reicht ein gedeckelter dt, um Sprünge nach Tab-Wechsel zu meiden.
      const rawMs = now - prev
      prev = now
      const dt = Math.min(rawMs, 60) / 1000

      if (phase === 'play') {
        linear += rawMs / (skipping ? SKIP_MS : duration)
        if (linear >= 1) {
          linear = 1
          phase = 'hold'
          holdT = 0
        }
      } else if (phase === 'hold') {
        holdT += rawMs
        if (holdT >= HOLD_MS) {
          phase = 'fade'
          fadeT = 0
        }
      } else if (phase === 'fade') {
        fadeT += rawMs
        root.style.opacity = String(1 - clamp01(fadeT / FADE_MS))
        if (fadeT >= FADE_MS) {
          phase = 'done'
          finish()
        }
      }

      const s = smoothstep(linear)
      mouse.sx += (mouse.x - mouse.sx) * 0.05
      mouse.sy += (mouse.y - mouse.sy) * 0.05
      stage.update(dt, s, mouse.sx, mouse.sy)
      updateCaptions(s)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouse)
      stage.dispose()
    }
    // Absicht: nur einmal beim Mounten aufsetzen; Props sind Startwerte.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={rootRef} className="intro-root">
      <div ref={canvasRef} className="intro-canvas" aria-hidden="true" />

      <div className="intro-ui">
        <span className="intro-brand">{brand}</span>
        {skipLabel && (
          <button type="button" className="intro-skip" onClick={() => skipRef.current()}>
            {skipLabel}
          </button>
        )}
      </div>

      <div className="intro-caps">
        {captions.map((cap, i) => (
          <div
            key={cap.mid}
            ref={(el) => {
              capRefs.current[i] = el
            }}
            className={`intro-cap${cap.hero ? ' intro-cap--hero' : ''}`}
          >
            {cap.eyebrow && <p className="intro-cap__eyebrow">{cap.eyebrow}</p>}
            <h2 className="intro-cap__title">{cap.title}</h2>
            {cap.text && <p className="intro-cap__text">{cap.text}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
