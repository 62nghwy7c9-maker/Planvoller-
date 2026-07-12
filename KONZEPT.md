# Planvoller GmbH — Kreativkonzept & Motion-Direktion

> Arbeitsstand: Konzept-Deliverable (Schritt 1 der Arbeitsweise). In einer autonomen
> Session umgesetzt — die unten getroffenen Annahmen sind als Entscheidungen markiert
> und können auf Zuruf geändert werden.

---

## Big Idea: **„Gefügt, nicht gebaut."**

Ein gutes Haus entsteht nicht durch Kraft, sondern durch Präzision: Teil für Teil,
Schritt für Schritt, in der richtigen Reihenfolge, am richtigen Platz. Die Website
inszeniert genau das — jedes Element der Seite **fügt sich** wie ein Bauteil:
es kommt aus einer Richtung, rastet präzise ein, eine Baukante zeichnet sich nach.
Der Beweis für „Herz und Verstand" wird nicht behauptet, sondern **vorgeführt**:
Sorgfalt ist spürbar in jeder Bewegung.

## 3 Design-Prinzipien

1. **Baukante** — Harte Kanten, keine Radien, Haarlinien als tragendes Ordnungselement.
   Linien zeichnen sich, wenn Inhalte einrasten. Das Raster ist sichtbar gebrochen,
   nie zufällig.
2. **Material statt Dekor** — Beton-Grau, warmes Sand/Holz, Anthrazit, eine einzige
   Akzentfarbe (Corten-Oxid). Farbe kommt aus dem Bauen, nicht aus dem Web.
3. **Ruhe vor Effekt** — Pro Section genau **ein** bewusster Move. Keine
   Dauer-Animation, kein Bounce. Bewegung erklärt Struktur und führt den Blick.

## Motion-Leitmotiv: **„Das Fügen"**

Ein einziges Bewegungsprinzip, überall: Elemente treffen versetzt ein
(eine Achse, Clip-Maske), **bremsen hart in einen präzisen Stand** (Expo-Out,
„Einrasten"), danach zeichnet sich eine 1-px-Fuge/Haarlinie nach.

- **Easing-System:** `cubic-bezier(.16,1,.3,1)` (Expo-Out, „snap") für Eintritte,
  `cubic-bezier(.65,.05,0,1)` für Übergänge/Wipes. Sonst nichts.
- **Dauer-Skala:** 200 ms (Micro) / 400 ms (Element) / 700 ms (Szene). Stagger 60 ms.
- Nur `transform` + `opacity` (+ `clip-path` für Reveals). Ziel 60 fps, CLS 0.

### Choreografie-Momente

| Ort | Move |
| --- | --- |
| **WebGL-Hero** | Haus-Volumen schweben als Kanten-Drahtmodell über dem Grund und **setzen sich beim Scrollen wie Kranmodule**: Kanten zuerst, dann materialisieren die Flächen (Beton/Anthrazit), zuletzt geht warmes Licht in den Fenstern an. Mobile/Reduced-Motion: Standbild (after.jpg). |
| **Manifest** | Wort-für-Wort-Scrub: Text wird beim Scrollen von Beton-Grau zu Tinte „gesetzt". |
| **15 Schritte** | Gepinntes Scrollytelling mit Scrub: Zähler 01→15, Fortschritts-Fuge füllt sich, Schritte fügen sich nacheinander. Mobil: ruhige Stapel-Liste. |
| **Headlines** | Zeilenweise Masken-Reveals mit 60-ms-Stagger. |
| **Micro** | Magnetische Buttons, Kontext-Cursor (nur Fein-Pointer), Bild-Hover mit Clip/Scale, Zahlen-Count-up. |
| **Seitenwechsel** | View Transitions API (Fade + 12-px-Fügung), Fallback: Enter-Stagger pro Section. |

## Marken-Anbindung (Stand: Überarbeitung v2, recherchiert auf planvoller.de)

- **Akzentfarbe:** Marken-Rost `#A84400` (aus der Logo-Wortmarke) + Olivgrau `#808374`
  für Claim/Kicker; auf dunklem Grund die Kontrastvariante `#CF6B26`.
- **Typo:** Work Sans (Markenschrift, variabel 100–900, self-hosted) für Display und Text —
  Differenzierung über Gewicht und Lauf statt über eine zweite Familie.
- **Logo:** echtes `planvoller-logo.svg` in Header und Intro.
- **Inhalte:** echte 15 Bau-Meilensteine, 5 echte Referenzen, echte Standortdaten
  (Morlaixplatz 15 · Ottostraße 4a · Industrieweg 13), Impressum mit GF Harald Vonhoegen.
- **Motion-Intensität:** „reich, aber kuratiert" — Page-Load-Intro, Hero-Fügung mit
  „15/15"-Abschluss, Scrollytelling mit Baustellen-Media, Shared-Element-Transitions.
- **Formular** validiert clientseitig; Versand per `data-endpoint` (POST) oder
  mailto-Fallback an info@planvoller.de.
- Bilder: Platzhalter unter fester Namenskonvention in `assets/img/` — echte Fotos
  ersetzen sie ohne Markup-Änderung (siehe README).

## Tech

Statisches Multi-Page-Setup ohne Build-Schritt. GSAP + ScrollTrigger (Choreografie),
Lenis (Smooth-Scroll), Three.js (Hero) und die Fonts werden **self-hosted**
(`assets/vendor/`, `assets/fonts/`) — DSGVO-freundlich, schnell, offline testbar.
Sauberes Degradieren: ohne JS bleibt die Seite vollständig lesbar,
`prefers-reduced-motion` erhält eine vollwertige ruhige Version.
