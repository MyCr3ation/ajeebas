import { useEffect, useRef } from 'react'
import { env } from '../lib/motion.js'

/**
 * "Chocolate, the Emirati way." Every letter is its own span on Fraunces' variable axes. Letters rise
 * in softly when the curtain lifts, then swell in weight and sink a touch under the pointer, like
 * chocolate warming under a finger.
 *
 * lines: array of lines; each line is an array of [text, italic?] runs.
 */
export default function MeltTitle({ id, className, lines, label, hoverScope }) {
  const ref = useRef(null)
  let i = 0

  useEffect(() => {
    const h = ref.current
    if (!h || env.reduce) return
    const chars = [...h.querySelectorAll('.melt__c')]
    h.classList.add('is-pre')
    const start = () => {
      requestAnimationFrame(() => requestAnimationFrame(() => h.classList.remove('is-pre')))
      setTimeout(() => h.classList.add('is-live'), 1300 + chars.length * 28)
    }
    if (window.__ajeebasReady) start()
    else window.addEventListener('ajeebas:ready', start, { once: true })

    if (!env.fine) return () => window.removeEventListener('ajeebas:ready', start)
    const scope = hoverScope?.current || h
    let raf = 0
    let mx = -1e4
    let my = -1e4
    let rects = []
    const measure = () => {
      rects = chars.map((c) => {
        const r = c.getBoundingClientRect()
        return [r.left + r.width / 2, r.top + r.height / 2, c.closest('em') ? 380 : 400]
      })
    }
    const update = () => {
      raf = 0
      chars.forEach((c, k) => {
        const [x, y, base] = rects[k] || [0, 0, 400]
        const d = Math.hypot(x - mx, y - my)
        const t = Math.max(0, 1 - d / 200)
        const e = t * t * (3 - 2 * t)
        c.style.setProperty('--w', String(Math.round(base + e * 320)))
        c.style.setProperty('--y', (e * 0.06).toFixed(3) + 'em')
      })
    }
    const move = (e) => {
      if (!rects.length) measure()
      mx = e.clientX
      my = e.clientY
      if (!raf) raf = requestAnimationFrame(update)
    }
    // lock the resting width (desktop): the swell then spills right, the block itself never moves
    const lock = () => {
      if (window.innerWidth < 900) {
        h.style.width = ''
        return
      }
      h.style.width = ''
      h.style.width = `${Math.ceil(h.getBoundingClientRect().width)}px`
    }
    const lockLater = () => setTimeout(lock, 50)
    document.fonts?.ready.then(lock)
    window.addEventListener('resize', lockLater)
    const enter = () => measure()
    const leave = () => {
      mx = my = -1e4
      if (!raf) raf = requestAnimationFrame(update)
    }
    scope.addEventListener('pointerenter', enter)
    scope.addEventListener('pointermove', move)
    scope.addEventListener('pointerleave', leave)
    window.addEventListener('scroll', enter, { passive: true })
    window.addEventListener('resize', enter)
    return () => {
      window.removeEventListener('ajeebas:ready', start)
      scope.removeEventListener('pointerenter', enter)
      scope.removeEventListener('pointermove', move)
      scope.removeEventListener('pointerleave', leave)
      window.removeEventListener('scroll', enter)
      window.removeEventListener('resize', enter)
      window.removeEventListener('resize', lockLater)
      cancelAnimationFrame(raf)
    }
  }, [hoverScope])

  const renderRun = (text, key) =>
    text.split(/(\s+)/).map((word, w) => {
      if (!word) return null
      if (/^\s+$/.test(word)) return ' '
      return (
        <span className="melt__w" key={`${key}-${w}`}>
          {[...word].map((ch) => (
            <span className="melt__c" style={{ '--i': i++ }} key={i}>
              {ch}
            </span>
          ))}
        </span>
      )
    })

  return (
    <h1 id={id} className={`melt ${className || ''}`} ref={ref}>
      <span className="sr-only">{label}</span>
      <span aria-hidden="true">
        {lines.map((line, li) => (
          <span className="melt__wrap" key={li}>
            {li > 0 && ' '}
            <span className="melt__line">
              {line.map(([text, italic], ri) => (italic ? <em key={ri}>{renderRun(text, `${li}-${ri}`)}</em> : <span key={ri}>{renderRun(text, `${li}-${ri}`)}</span>))}
            </span>
          </span>
        ))}
      </span>
    </h1>
  )
}
