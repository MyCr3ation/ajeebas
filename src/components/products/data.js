// Product lines for the collection. Copy comes from the packaging and the client's "What we make" lines.
// Colours are brand palette only; each variant repaints its panel.

export const DATES = {
  id: 'line-dates',
  short: 'Dates',
  label: 'Dates chocolate',
  titleItalic: 'The',
  titleCaps: 'Dates edit',
  letters: 'DATES',
  script: 'Rich & Indulgent',
  style: 'Dubai Style',
  claims: [
    ['leaf', 'Premium Dates'],
    ['pod', 'Smooth Chocolate'],
    ['heart', 'No Artificial Flavours'],
  ],
  variants: [
    { key: 'dark', tab: 'Almond Dark', name: 'Almond (Dark)', img: '/images/cut/dates-almond-dark-pouch.webp', w: 896, h: 1341, alt: 'Ajeebas Premium Dates Chocolate pouch, Almond (Dark)', tone: 'dark', swatch: 'var(--choc)', ings: ['almond', 'chunk', 'almond', 'date', 'chunk', 'almond'] },
    { key: 'milk', tab: 'Almond Milk', name: 'Almond (Milk)', img: '/images/cut/dates-almond-milk-pouch.webp', w: 881, h: 1186, alt: 'Ajeebas Premium Dates Chocolate pouch, Almond (Milk)', tone: 'light', swatch: 'var(--sand)', ings: ['chunk', 'almond', 'date', 'almond', 'almond', 'chunk'] },
    { key: 'pistachio', tab: 'Pistachio', name: 'Pistachio', img: '/images/cut/dates-pistachio-pouch.webp', w: 890, h: 1332, alt: 'Ajeebas Premium Dates Chocolate pouch, Pistachio', tone: 'light', swatch: 'var(--dpist)', ings: ['pistachio', 'pistachio-shell', 'pistachio', 'date', 'pistachio-shell', 'pistachio'] },
    { key: 'assorted', tab: 'Assorted', name: 'Assorted', img: '/images/cut/dates-assorted-pouch.webp', w: 912, h: 1369, alt: 'Ajeebas Premium Dates Chocolate pouch, Assorted', tone: 'light', swatch: 'conic-gradient(var(--choc) 0 25%, var(--sand) 0 50%, var(--dpist) 0 75%, var(--caramel) 0)', ings: ['coconut', 'pistachio', 'almond', 'date', 'coconut', 'chunk'] },
  ],
}

export const CRUNCH = {
  id: 'line-crunch',
  short: 'Crunch sticks',
  label: 'Crunch sticks',
  titleItalic: 'The',
  titleCaps: 'Crunch edit',
  letters: 'CRUNCH',
  script: 'Crisp & Golden',
  style: 'Crunch Stick',
  claims: [
    ['leaf', 'Real nut flavour'],
    ['pod', 'Pouch & single'],
    ['heart', 'Made in Dubai'],
  ],
  foot: 'Made in Dubai',
  variants: [
    { key: 'cpist', tab: 'Pistachio', name: 'Pistachio Chocolate', img: '/images/cut/crunch-stick-pistachio-pouch.webp', w: 684, h: 1041, alt: 'Ajeebas Crunch Stick pouch, Pistachio Chocolate', extra: { img: '/images/cut/crunch-stick-pistachio-wrapper.webp', w: 729, h: 540, alt: 'Ajeebas Crunch Stick single wrapper, Pistachio Chocolate' }, tone: 'light', swatch: 'var(--dpist)', ings: ['pistachio', 'pistachio-shell', 'pistachio', 'chunk', 'pistachio-shell', 'pistachio'] },
    { key: 'calmond', tab: 'Almond', name: 'Almond Chocolate', img: '/images/cut/crunch-stick-almond-pouch.webp', w: 686, h: 1043, alt: 'Ajeebas Crunch Stick pouch, Almond Chocolate', extra: { img: '/images/cut/crunch-stick-almond-wrapper.webp', w: 965, h: 610, alt: 'Ajeebas Crunch Stick single wrapper, Almond Chocolate' }, tone: 'dark', swatch: 'var(--caramel)', ings: ['almond', 'chunk', 'almond', 'almond', 'chunk', 'almond'] },
  ],
}

export const TRUFFLE = {
  id: 'line-truffle',
  short: 'Truffle',
  label: 'Truffle',
  titleItalic: 'The',
  titleCaps: 'Truffle edit',
  letters: 'TRUFFLE',
  script: 'Little bite of happiness',
  style: 'Truffle',
  claims: [
    ['leaf', 'Dates'],
    ['pod', 'Milk Chocolate'],
    ['heart', 'Desiccated Coconut'],
  ],
  claimsLabel: 'Ingredients',
  foot: 'Made in Dubai',
  variants: [
    { key: 'coconut', tab: 'Coconut Truffles', name: 'Coconut Truffles', img: '/images/cut/coconut-truffle-filled-bar-wrapper.webp', w: 1100, h: 592, wide: true, alt: 'Ajeebas Coconut Truffles wrapper', tone: 'light', swatch: 'var(--white)', ings: ['coconut', 'coconut', 'chunk', 'date', 'coconut', 'chunk'] },
  ],
}

export const FILLED = {
  id: 'line-filled',
  short: 'Filling chocolate',
  label: 'Filling chocolate',
  titleItalic: 'The',
  titleCaps: 'Filled edit',
  letters: 'FILLED',
  script: 'Coming soon',
  style: 'Filled bar',
  claims: [],
  claimsLabel: 'Private label welcome',
  foot: 'More flavours coming soon',
  variants: [
    { key: 'soon', tab: 'Coming soon', name: 'More flavours', soon: true, tone: 'light', swatch: 'var(--pist)', ings: ['pistachio', 'almond', 'date', 'pistachio-shell', 'chunk', 'coconut'] },
  ],
}

export const KUNAFA = { id: 'line-kunafa', short: 'Kunafa bar' }

export const PANELS = [DATES, CRUNCH, KUNAFA, TRUFFLE, FILLED]
