# Vorher/Nachher Schieberegler

Der Bildvergleichs-Schieberegler wie auf housedesign.ai – eine einzige HTML-Datei, keine Abhängigkeiten.

## Eigene Bilder einsetzen

1. Lege deine zwei Bilder neben die `index.html` (z.B. `vorher.jpg` und `nachher.jpg`).
2. Öffne `index.html` und ersetze die beiden Bildpfade (der Kommentar im Code zeigt die Stelle):
   - `src="before.svg"` → `src="vorher.jpg"`
   - `src="after.svg"` → `src="nachher.jpg"`
3. `index.html` im Browser öffnen – fertig. Ziehen mit Maus oder Finger.

Beide Bilder sollten das gleiche Seitenverhältnis haben. Die beiden mitgelieferten SVGs sind nur Demo-Bilder und können gelöscht werden, sobald eigene Bilder eingetragen sind.

Zum Einbauen in eine bestehende Seite: den `<style>`-Block, das `<div class="compare">…</div>` und den `<script>`-Block kopieren – mehrere Regler auf einer Seite funktionieren automatisch.
