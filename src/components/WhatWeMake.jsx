import { useEffect, useRef } from 'react'
import { gsap, env } from '../lib/motion.js'
import { Icon } from './Sprite.jsx'

export const LINES = [
  { id: 'line-dates', name: 'Dates chocolate', text: 'soft, rich dates wrapped in chocolate, in Almond Dark, Almond Milk and Pistachio.' },
  { id: 'line-crunch', name: 'Crunch sticks', text: 'crisp, golden and full of real nut flavour, in Pistachio and Almond.' },
  { id: 'line-kunafa', name: 'Kunafa bar', text: 'the flavour of a beloved dessert, in a bar you can break and share.' },
  { id: 'line-filled', name: 'Filled compound chocolate', text: 'bars with a range of fillings, from coconut truffle to more flavours coming soon.' },
]

// nuts, dates and crumbs drifting down the gutter between the columns (left %, top %, size px, icon, depth)
const CRUMBS = [
  [46, 4, 44, 'almond', 1.4],
  [53, 16, 30, 'pistachio', 0.8],
  [44, 34, 26, 'chunk', 1.1],
  [51, 44, 52, 'pistachio-shell', 1.6],
  [5, 12, 30, 'almond', 0.7],
  [47, 62, 38, 'date', 1.2],
  [54, 76, 24, 'pistachio', 0.9],
  [45, 88, 32, 'chunk', 1.5],
  [90, 90, 28, 'almond', 1],
  [28, 92, 24, 'pistachio', 0.8],
]

/** The range as a menu card: four numbered lines, each with a button that jumps to its product. */
export default function WhatWeMake() {
  const ref = useRef(null)
  useEffect(() => {
    if (env.reduce) return
    const root = ref.current
    const ctx = gsap.context(() => {
      root.querySelectorAll('.crumb').forEach((c) => {
        const depth = +c.dataset.depth
        gsap.fromTo(c, { y: -60 * depth, rotate: -40 * depth }, { y: 160 * depth, rotate: 60 * depth, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
      gsap.from(root.querySelectorAll('.menu-card li'), { y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: root.querySelector('.menu-card'), start: 'top 78%' } })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="range" id="what-we-make" ref={ref} aria-labelledby="range-title">
      <div className="range__crumbs" aria-hidden="true">
        {CRUMBS.map(([l, t, s, id, depth], i) => (
          <svg key={i} className="crumb" data-depth={depth} style={{ left: `${l}%`, top: `${t}%`, width: s, height: s }}>
            <use href={`#i-${id}`} />
          </svg>
        ))}
      </div>
      <div className="wrap range__grid">
        <div className="range__head rv">
          <p className="label label--fraunces range__label">
            <span className="label__num">02</span>The range
          </p>
          <h2 className="range__title fr" id="range-title">
            What we make
          </h2>
          <p className="range__intro">Four lines, one table. Every pack is made in Dubai.</p>
        </div>
        <ol className="menu-card" aria-label="Product lines">
          {LINES.map((l, i) => (
            <li key={l.id}>
              <span className="menu-card__n" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p>
                <strong>{l.name}:</strong> {l.text}
              </p>
              <a className="menu-card__go" href={`#${l.id}`} aria-label={`See ${l.name.toLowerCase()}`}>
                <Icon id="down" />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
