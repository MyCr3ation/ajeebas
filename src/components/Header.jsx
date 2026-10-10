import { useEffect, useRef, useState } from 'react'
import { parts, VB } from '../lib/logo.js'
import { getLenis } from '../lib/motion.js'

export const NAV = [
  { id: 'our-story', label: 'Our story' },
  { id: 'what-we-make', label: 'What we make' },
  { id: 'promises', label: 'Promises' },
  { id: 'made-in-the-uae', label: 'The factory' },
  { id: 'leadership', label: 'Leadership' },
]
const MENU = [...NAV, { id: 'work-with-us', label: 'Work with us' }]

export function BrandMark({ className = '' }) {
  return (
    <>
      <svg className={`brand__emblem ${className}`} viewBox={VB.emblem.join(' ')} fill="currentColor" aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: parts.emblem }} />
      <svg className={`brand__wordmark ${className}`} viewBox={VB.wordmark.join(' ')} fill="currentColor" aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: parts.wordmark }} />
    </>
  )
}

/**
 * Fixed navbar. Its tone follows whatever section sits under it ([data-header="dark"|"light"]),
 * it gains a frosted bar once you scroll, and it tucks away while you read downwards.
 */
export default function Header() {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(null)
  const btnRef = useRef(null)

  useEffect(() => {
    const el = ref.current
    let lastY = window.scrollY
    let raf = 0
    const update = () => {
      raf = 0
      const y = window.scrollY
      // tone: the last [data-header] block that covers the bar's midline
      let tone = 'light'
      const line = 38
      document.querySelectorAll('[data-header]').forEach((s) => {
        const r = s.getBoundingClientRect()
        if (r.top <= line && r.bottom > line) tone = s.dataset.header
      })
      el.dataset.tone = tone
      el.classList.toggle('is-scrolled', y > 40)
      const down = y > lastY + 4
      const up = y < lastY - 4
      if (down && y > window.innerHeight * 1.2 && !document.documentElement.classList.contains('menu-open')) el.classList.add('is-hidden')
      else if (up || y < 80) el.classList.remove('is-hidden')
      lastY = y
      // current chapter
      let cur = null
      for (const n of NAV) {
        const s = document.getElementById(n.id)
        if (s && s.getBoundingClientRect().top < window.innerHeight * 0.45) cur = n.id
      }
      setCurrent((c) => (c === cur ? c : cur))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    // the hero / collection change their tone without the page scrolling
    window.addEventListener('ajeebas:tone', onScroll)
    update()
    const focusIn = () => el.classList.remove('is-hidden')
    el.addEventListener('focusin', focusIn)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('ajeebas:tone', onScroll)
      el.removeEventListener('focusin', focusIn)
      cancelAnimationFrame(raf)
    }
  }, [])

  // mobile menu: lock scroll, Escape closes, focus stays inside
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('menu-open', open)
    const lenis = getLenis()
    if (open) lenis?.stop()
    else lenis?.start()
    if (!open) return
    const menu = document.getElementById('menu')
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btnRef.current?.focus()
      }
      if (e.key === 'Tab') {
        const f = [btnRef.current, ...menu.querySelectorAll('a')]
        const i = f.indexOf(document.activeElement)
        if (e.shiftKey && i <= 0) {
          e.preventDefault()
          f[f.length - 1].focus()
        } else if (!e.shiftKey && i === f.length - 1) {
          e.preventDefault()
          f[0].focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <header className="nav" ref={ref} data-tone="dark">
        <a className="brand" href="#top" aria-label="Ajeebas Chocolate, back to the top">
          <BrandMark />
        </a>
        <nav className="nav__links" aria-label="Primary">
          <ul>
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} aria-current={current === n.id ? 'true' : undefined}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav__actions">
          <a className="btn btn--pist btn--sm nav__cta" href="#work-with-us">
            <span>Stock Ajeebas</span>
          </a>
          <button ref={btnRef} className="nav__menu-btn" type="button" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)}>
            <span className="nav__menu-label">{open ? 'Close' : 'Menu'}</span>
            <span className="nav__menu-icon" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>

      <div className={`menu${open ? ' is-open' : ''}`} id="menu" hidden={!open} onClick={(e) => e.target.closest('a') && close()}>
        <nav aria-label="Mobile">
          <ol>
            {MENU.map((n, i) => (
              <li key={n.id} style={{ '--i': i }}>
                <a href={`#${n.id}`}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {n.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="menu__foot">
          <a className="btn btn--pist" href="#work-with-us">
            <span>Stock Ajeebas</span>
          </a>
          <a className="menu__mail" href="mailto:info@ajeebaschocolate.com">
            info@ajeebaschocolate.com
          </a>
        </div>
      </div>
    </>
  )
}
