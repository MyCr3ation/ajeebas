# Ajeebas Chocolate: website (website-4)

Marketing site for **Ajeebas Chocolate**, a new chocolate factory in Al Qusais Industrial Area 4, Dubai,
opening **23 October 2026**. It combines the client's favourite parts of three earlier design explorations
(`website-1`, `website-2`, `website-3`) into one site, built with React + Vite.

The site has no backend: it is a static single-page build that can be hosted anywhere (Vercel, Netlify,
S3, any web server).

---

## Quick start

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev        # http://localhost:5204
```

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload on port 5204 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serves the production build locally (port 5204) |
| `npm run lint` | Lints the code with oxlint |

---

## Page structure

| # | Section | Origin | What it does |
|---|---|---|---|
| 1 | Opening titles + navbar | website-1 intro, website-3 navbar | The logo draws itself in gold, then the emblem and wordmark fly into the navbar while the page fades in (about 3.4 s). A click, scroll or key press skips it. The navbar changes tone over light/dark sections and hides while you read downwards. |
| 2 | Hero | website-1 arch, website-3 headline | Dark arch; scrolling pushes the camera through it into the cream world with the dates pouches. Molten chocolate (WebGL) pours from the arch and runs down behind the Almond (Dark) pouch; it shows through the pouch's cut-out hang hole and carries on into the pour printed on the pack. The headline letters swell under the mouse (this section only). |
| 3 | Flavour tapes | website-2 | Two crossing marquee bands; speed follows scroll velocity and direction. |
| 4 | Our story | website-2 | Words ink in as you scroll; key phrases get a pistachio highlight. |
| 5 | What we make | website-3 | The four product lines as a menu card; each arrow jumps to its product panel. |
| 6 | Products | website-1 horizontal scroll + website-2 "Edit" design | Pinned section moved sideways by your own scrolling (screens 1024 px and wider; stacked below that). Panels: Dates, Crunch sticks, Kunafa spotlight, Truffle (Coconut Truffles), Filling chocolate (more flavours coming soon). Each panel repaints in the selected flavour's colours; flavours rotate on a timer while the panel is on screen (pause/play button; choosing a flavour pauses it). |
| 7 | Our four promises | website-2 (compacted) | Cards dock on top of each other while scrolling and leave together. |
| 8 | Made in the UAE | website-2 | Live countdown to the opening; switches to "Now open" on 23 Oct 2026 (Dubai time). |
| 9 | Leadership | website-2 | CEO section. |
| 10 | Work with us | website-3 layout | Partnership form on an espresso background with gold lattice and arch. |
| 11 | Footer | website-2 | Logo, links, contact. |

---

## Tech stack

- **React 19** + **Vite 8**
- **GSAP 3** (ScrollTrigger, SplitText) for scroll-driven and timed animation
- **Lenis** for smooth scrolling (disabled when the visitor prefers reduced motion)
- **WebGL 2** for the chocolate pour (custom signed-distance-field shader in `src/lib/pour.js`, no 3D library)
- Fonts bundled locally via Fontsource (no external font requests)

---

## Project structure

```
website-4/
├── index.html                  # meta tags, Open Graph, favicon
├── public/
│   ├── favicon.svg
│   ├── logo/                   # all logo variants (SVG)
│   ├── images/
│   │   ├── cut/                # product cut-outs (transparent WebP)
│   │   ├── kunafa-bar-placeholder.svg   # illustrated Kunafa bar (placeholder, see below)
│   │   └── og-ajeebas.jpg      # social sharing image
│   └── textures/               # arch mask + emblem lattice pattern
└── src/
    ├── main.jsx                # fonts + styles + app entry
    ├── App.jsx                 # page order, smooth scroll, anchors, reveals
    ├── assets/                 # logo SVG sources (inlined so their parts can animate)
    ├── components/
    │   ├── Intro.jsx           # opening titles + logo flight to the navbar
    │   ├── Header.jsx          # navbar + mobile menu
    │   ├── Hero.jsx            # arch, scroll push-through, pour
    │   ├── MeltTitle.jsx       # mouse-reactive hero headline
    │   ├── Bands.jsx           # flavour tapes
    │   ├── Story.jsx
    │   ├── WhatWeMake.jsx
    │   ├── products/
    │   │   ├── data.js         # product lines, flavours, images, colours  <- edit products here
    │   │   ├── Products.jsx    # horizontal pin / stacked layout, progress rail
    │   │   ├── EditPanel.jsx   # "The ___ edit" flavour panel
    │   │   └── KunafaPanel.jsx # Kunafa spotlight
    │   ├── Promises.jsx
    │   ├── Factory.jsx         # Made in the UAE + countdown
    │   ├── Leadership.jsx
    │   ├── Partner.jsx         # Work with us + form
    │   ├── Footer.jsx
    │   └── Sprite.jsx          # small icons and ingredient pictograms
    ├── lib/
    │   ├── motion.js           # GSAP/Lenis setup, anchor scrolling, reveals
    │   ├── pour.js             # WebGL chocolate pour
    │   ├── countdown.js        # opening date + countdown hook  <- opening date lives here
    │   ├── logo.js             # splits the logo into animatable parts
    │   └── arch.js             # the Ajeebas arch shape + lattice pattern
    └── styles/
        ├── base.css            # palette tokens, type, buttons
        ├── header.css, intro.css, hero.css
        ├── sections.css        # tapes, story, range, promises, factory, leadership, partner, footer
        └── products.css        # the collection
```

---

## Brand rules (please keep)

- **Palette only.** All UI colours come from the client's palette (defined as CSS variables at the top of
  `src/styles/base.css`). Logo gold `#BD9D28` is for the logo and fine ornaments only.
- **Copy is the client's, verbatim.** Hero, Our story, What we make, Our four promises, Made in the UAE,
  Leadership and Work with us use the text from `Details/About us.txt` word for word. Don't invent facts
  (prices, reviews, awards, statistics, phone numbers, social handles).
- **Contact email:** `info@ajeebaschocolate.com` (this replaces the `sales@` address in the copy file).
- **Typography:**
  - Archivo: condensed display caps and all body/UI text.
  - Instrument Serif: the serif in the website-2 sections.
  - Fraunces: **only** the website-3 parts (hero headline, What we make, Work with us).
  - Allura: only the packaging script ("Rich & Indulgent").

---

## Common edits

| To change | Edit |
|---|---|
| Products, flavours, pack images, panel colours | `src/components/products/data.js` (colours per flavour in `src/styles/products.css`, `.edit[data-variant=...]`) |
| Opening date / countdown | `OPENING` in `src/lib/countdown.js` |
| Navbar links | `NAV` in `src/components/Header.jsx` |
| Contact email | `MAIL` in `src/components/Partner.jsx`, plus `Header.jsx` and `Footer.jsx` |
| Section copy | the matching component in `src/components/` |
| Kunafa bar image | replace `public/images/kunafa-bar-placeholder.svg` (see below) |

### Product images

Source photos live in `../brand-assets/images/` (one file per pack, named like `dates-almond-dark-pouch.jpg`).
The site uses transparent cut-outs of them in `public/images/cut/` (same names, `.webp`). Every pouch
cut-out has its hang hole cut out (transparent) so the hero pour can show through it. When a pack photo
changes: cut it out cleanly, punch out the hang hole, save it over the old `.webp` with the same name, and
update its `w`/`h` in `src/components/products/data.js` (and in `Hero.jsx` for the three hero pouches).

### Kunafa bar placeholder

There is no product photo of the Kunafa bar yet. `public/images/kunafa-bar-placeholder.svg` is an
illustrated placeholder in the style of the other wrappers. Its parts are animated when the panel appears
(the bar snaps in half), using the SVG's element ids (`#kb-left`, `#kb-right`, `.kb-strand`).

To use a real photo:
1. Replace the `<img>` in `KunafaPanel.jsx` with the photo.
2. Remove the fetch/inline step in the same file, which only works with the SVG.

### Contact form

The form has no backend. It validates the fields, then opens the visitor's email app with a pre-filled
message to `info@ajeebaschocolate.com`. To collect submissions directly instead, point the submit handler in
`Partner.jsx` at a form service or API.

---

## Browser support and accessibility

- **Browsers:** tested in Chrome, Firefox, WebKit (Safari's engine), and iPhone WebKit at 390 px, 768 px,
  1024 px, 1280×720, 1366×768, 1440 px, 1920 px and 2560 px.
- **Without WebGL:** the pour falls back to a simple CSS stream.
- **Reduced motion:** with `prefers-reduced-motion`, visitors get a calm version. There is no intro, the
  horizontal pin and smooth scroll are off, the promises become a plain list, and the pour shows as a still
  image.
- **Keyboard and screen readers:** semantic landmarks, one `<h1>`, alt text and a skip link. Flavour tabs
  support keyboard arrows. The mobile menu traps focus and closes with Escape.
- **Contrast:** text meets WCAG AA.

## Before going live

- Set absolute URLs for `og:image` (and add `og:url`) in `index.html` once the domain is known.
- Fraunces is loaded with all its variable axes (about 550 KB across subsets); it can be trimmed if page
  weight matters.
