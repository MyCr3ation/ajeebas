/**
 * The Ajeebas arch: the onion/ogee dome of the emblem (concave flick at the finial, convex dome,
 * vertical sides). Proportions are relative to the arch width, so the dome never distorts.
 */
export function archD(x, y, w, h, closed = true) {
  const P = (u, v) => `${(x + u * w).toFixed(2)},${(y + v * w).toFixed(2)}`
  const bottom = (y + Math.max(h, 0.56 * w)).toFixed(2)
  const d =
    `M${x.toFixed(2)},${bottom} L${P(0, 0.56)} ` +
    `C${P(0, 0.38)} ${P(0.12, 0.24)} ${P(0.36, 0.14)} ` +
    `C${P(0.44, 0.1)} ${P(0.49, 0.06)} ${P(0.5, 0)} ` +
    `C${P(0.51, 0.06)} ${P(0.56, 0.1)} ${P(0.64, 0.14)} ` +
    `C${P(0.88, 0.24)} ${P(1, 0.38)} ${P(1, 0.56)} ` +
    `L${(x + w).toFixed(2)},${bottom}`
  return closed ? d + ' Z' : d
}

/**
 * One seamless tile of the emblem's lattice: flat-top hexagons on a triangular grid with every
 * third site left open, which leaves six-point star voids between them (as in the logo's arch band).
 */
export function latticeTile(a = 10) {
  const W = 6 * a
  const H = 2 * a * Math.sqrt(3)
  const seen = new Set()
  let d = ''
  for (let j = -3; j < 5; j++) {
    for (let i = -4; i < 7; i++) {
      if ((((i - j) % 3) + 3) % 3 === 0) continue
      const cx = i * 2 * a + j * a
      const cy = j * a * Math.sqrt(3)
      for (const ox of [-W, 0, W]) {
        for (const oy of [-H, 0, H]) {
          const X = cx + ox
          const Y = cy + oy
          if (X <= -2 * a || X >= W + 2 * a || Y <= -2 * a || Y >= H + 2 * a) continue
          const key = `${X.toFixed(2)}|${Y.toFixed(2)}`
          if (seen.has(key)) continue
          seen.add(key)
          d += 'M'
          for (let k = 0; k < 6; k++) {
            const ang = (Math.PI / 3) * k
            d += `${(X + a * Math.cos(ang)).toFixed(2)},${(Y + a * Math.sin(ang)).toFixed(2)}${k < 5 ? ' L' : 'Z'}`
          }
        }
      }
    }
  }
  return { W, H, d }
}

/**
 * Keep an SVG outline (one or two arch lines) in sync with an element's size.
 * `lines` = [{ inset, top, stroke }], measured in px.
 */
const NS = 'http://www.w3.org/2000/svg'
export function archOutline(host, lines, className = 'niche-line', place = null) {
  const svg = document.createElementNS(NS, 'svg')
  svg.setAttribute('class', className)
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('focusable', 'false')
  const paths = lines.map((l) => {
    const p = document.createElementNS(NS, 'path')
    p.setAttribute('stroke-width', l.width ?? 1)
    if (l.opacity) p.setAttribute('stroke-opacity', l.opacity)
    p.setAttribute('pathLength', '1')
    svg.appendChild(p)
    return p
  })
  if (place) host.after(svg)
  else host.appendChild(svg)
  const update = () => {
    const w = host.offsetWidth
    const h = host.offsetHeight
    if (!w || !h) return
    if (place) {
      svg.style.left = host.offsetLeft + 'px'
      svg.style.top = host.offsetTop + 'px'
      svg.style.width = w + 'px'
      svg.style.height = h + 'px'
    }
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
    lines.forEach((l, i) => {
      paths[i].setAttribute('d', archD(l.inset, l.top, w - l.inset * 2, h - l.top - (l.bottom ?? l.inset), l.closed ?? false))
    })
  }
  update()
  new ResizeObserver(update).observe(host)
  return { svg, paths, update }
}
