import { useEffect, useRef } from 'react'
import { gsap, env } from '../../lib/motion.js'

const SRC = '/images/kunafa-bar-placeholder.svg'

/**
 * Kunafa spotlight. The placeholder illustration (there is no photo of the bar yet) is inlined so its
 * halves can move: when the panel arrives the bar snaps, the pistachio-kunafa strands stretch and crumbs
 * fall. A loupe shows the break up close; the giant outline word fills as the panel slides in.
 */
export default function KunafaPanel({ index, active, onTone }) {
  const ref = useRef(null)
  const svgRef = useRef(null)
  const played = useRef(false)

  useEffect(() => {
    if (active) onTone?.('light')
  }, [active, onTone])

  useEffect(() => {
    if (env.reduce) return
    const holder = ref.current.querySelector('.kunafa__svg')
    let cancelled = false
    fetch(SRC)
      .then((r) => (r.ok ? r.text() : null))
      .then((text) => {
        if (!text || cancelled) return
        const doc = new DOMParser().parseFromString(text, 'image/svg+xml')
        const svg = doc.documentElement
        if (!svg || svg.nodeName.toLowerCase() !== 'svg') return
        const node = document.importNode(svg, true)
        node.removeAttribute('width')
        node.removeAttribute('height')
        node.classList.add('kb')
        holder.replaceChildren(node)
        svgRef.current = node
        const strands = node.querySelectorAll('.kb-strand')
        strands.forEach((p) => {
          const l = p.getTotalLength()
          p.style.strokeDasharray = `${l}`
          p.style.strokeDashoffset = played.current ? '0' : `${l}`
        })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  // the snap plays the first time the panel is on screen
  useEffect(() => {
    if (!active || played.current || env.reduce) return
    let tries = 0
    let tl = null
    let to = 0
    const play = () => {
      const svg = svgRef.current
      if (!svg) {
        if (tries++ < 20) to = setTimeout(play, 150)
        return
      }
      played.current = true
      const q = (s) => svg.querySelector(s)
      const strands = svg.querySelectorAll('.kb-strand')
      const crumbs = svg.querySelectorAll('#kb-strands > path:not(.kb-strand)')
      tl = gsap.timeline()
      tl.from(svg, { yPercent: 10, opacity: 0, duration: 1.1, ease: 'expo.out' })
        .fromTo(q('#kb-left'), { x: 30, rotation: 3, svgOrigin: '700 560' }, { x: 0, rotation: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)' }, 0.6)
        .fromTo(q('#kb-right'), { x: -28, rotation: -3, svgOrigin: '700 560' }, { x: 0, rotation: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)' }, 0.6)
        .to(strands, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.out', stagger: 0.012 }, 0.65)
        .from(crumbs, { y: -26, opacity: 0, duration: 0.8, ease: 'bounce.out', stagger: 0.015 }, 0.7)
        .from(svg.querySelectorAll('#kb-botanicals > *'), { opacity: 0, duration: 1.2, stagger: 0.04, ease: 'power2.out' }, 0.2)
        .from(ref.current.querySelectorAll('.kunafa__tags li'), { y: 16, opacity: 0, stagger: 0.08, duration: 0.8, ease: 'expo.out' }, 0.3)
        .from(ref.current.querySelector('.kunafa__loupe'), { scale: 0.6, opacity: 0, duration: 0.9, ease: 'back.out(2)' }, 0.9)
    }
    play()
    return () => clearTimeout(to)
  }, [active])

  return (
    <article className="panel kunafa" id="line-kunafa" ref={ref} data-tone="light" aria-labelledby="kunafa-title">
      <p className="kunafa__word" aria-hidden="true">
        Kunafa
      </p>
      <div className="kunafa__inner wrap">
        <div className="kunafa__copy">
          <p className="label">
            <span className="label__num">{String(index + 1).padStart(2, '0')}</span>Spotlight
          </p>
          <h3 className="kunafa__title" id="kunafa-title">
            <span className="display">Kunafa</span> <span className="serif-i">bar</span>
          </h3>
          <p className="kunafa__lede serif-i">Break it. Share it.</p>
          <ul className="kunafa__tags label">
            <li>Dubai Style</li>
            <li>Made in Dubai</li>
            <li>Premium Quality Chocolate</li>
          </ul>
          <a className="btn btn--cocoa" href="#work-with-us">
            <span>Ask about the Kunafa bar</span>
            <svg aria-hidden="true">
              <use href="#i-arrow" />
            </svg>
          </a>
        </div>
        <figure className="kunafa__fig">
          <div className="kunafa__art">
          <figcaption className="label">Kunafa bar, illustrated preview</figcaption>
          <div className="kunafa__svg">
            <img src={SRC} width="1400" height="900" alt="Ajeebas Kunafa Bar: a chocolate-brown wrapper with gold pistachio branches, and a thick bar snapped in half showing pistachio cream and golden kunafa strands" loading="lazy" decoding="async" />
          </div>
          <div className="kunafa__loupe" aria-hidden="true">
            <svg viewBox="498 386 196 196" preserveAspectRatio="xMidYMid slice">
              <image href={SRC} width="1400" height="900" />
            </svg>
            <span className="kunafa__loupe-tag label">The break, up close</span>
          </div>
          </div>
        </figure>
      </div>
    </article>
  )
}
