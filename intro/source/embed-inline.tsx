// embed-inline — montiert das Haus-Intro als Vollbild-Overlay über der
// bestehenden Seite. Läuft einmal pro Sitzung (sessionStorage), blendet aus und
// entfernt sich selbst. Mit ?intro in der URL lässt es sich erneut abspielen.
// Wird als eine inline eingebettete <script>-Datei in eine bestehende HTML-Seite
// gehängt — keine Änderung am restlichen Seitencode nötig.
import { createRoot } from 'react-dom/client'
import '@fontsource/instrument-serif/index.css'
import HouseIntro from './intro/HouseIntro'

const KEY = 'haus-intro-gesehen'
const force = new URLSearchParams(window.location.search).has('intro')

if (force || !sessionStorage.getItem(KEY)) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const root = createRoot(host)
  const done = () => {
    sessionStorage.setItem(KEY, '1')
    root.unmount()
    host.remove()
  }
  root.render(<HouseIntro onComplete={done} />)
}
