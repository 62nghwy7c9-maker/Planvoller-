# HouseDesign – AI House Design Tool (Rebuild)

A rebuild of the AI house design tool from [housedesign.ai](https://housedesign.ai/): upload a photo of your house or room, choose a style, and visualize a redesigned version in seconds — complete with a draggable before/after comparison slider.

Built as a fully static site: plain HTML, CSS and vanilla JavaScript. No build step, no dependencies.

## Run it

Open `index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Features

- **Design tool panel** – photo upload via click, drag & drop, or paste (Ctrl/⌘+V)
- **Design type** – Interior or Exterior
- **Room types** (interior) – Living Room, Bedroom, Kitchen, Bathroom, Dining Room, Office
- **Styles** – Interior: Modern, Minimalist, Scandinavian, Industrial, Rustic, Bohemian · Exterior: Modern, Contemporary, Farmhouse, Colonial, Mediterranean, Zen
- **Before/after compare slider** – on the hero demo and on every generated result
- **Design history** – recent generations stored in `localStorage`, shown in the history drawer (clock icon in the header)
- **Download** – save the generated design as a JPEG
- Full landing page: 3-step guide, features, use cases, testimonials, FAQ, CTA

## Generation modes

| Mode | How it works |
|------|--------------|
| **Demo mode** (default) | The redesign preview is rendered locally in your browser with a canvas-based color grade matched to the selected style. No account, no key, no server. |
| **AI mode** | Click *"Set API key"* under the Design Now button and paste a [Google Gemini API key](https://aistudio.google.com/apikey). Generations then use Gemini image-to-image (`gemini-2.5-flash-image`) with style prompts, preserving the structure and perspective of your photo. The key is stored only in your browser's `localStorage` and sent only to Google's API. |

## Project structure

```
index.html          – landing page + design tool
assets/css/style.css – styling (green brand theme)
assets/js/app.js     – tool logic: upload, styles, generation, history, compare slider
assets/img/          – hero before/after illustrations, favicon (all original SVG)
```

All images are original SVG illustrations — no assets are copied from housedesign.ai.
