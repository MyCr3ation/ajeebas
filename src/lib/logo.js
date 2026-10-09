import logoRaw from '../assets/ajeebas-logo.svg?raw'

/**
 * The vector logo, split into its named groups so the parts can be drawn and moved independently.
 * Fills become currentColor so the colour follows CSS (gold on dark, cocoa on cream).
 */
function groups(raw) {
  const out = {}
  const re = /<g id="([a-z]+)">([\s\S]*?)<\/g>/g
  let m
  while ((m = re.exec(raw))) out[m[1]] = m[2]
  return out
}
const g = groups(logoRaw)

// viewBoxes of the regions inside the full lock-up (same as the separate emblem / wordmark files)
export const VB = {
  logo: [44, 31, 487, 421],
  emblem: [172, 33, 227, 227],
  wordmark: [44, 262, 487, 190],
}

export const parts = {
  emblem: `<g data-part="emblem">${g.emblem}</g>`,
  divider: `<g data-part="divider">${g.divider}</g>`,
  wordmark: `<g data-part="wordmark">${g.wordmark}</g><g data-part="tagline">${g.tagline}</g><g data-part="flourish">${g.flourish}</g>`,
}
