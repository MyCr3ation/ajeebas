import { useEffect, useRef } from 'react'
import { gsap, env } from '../lib/motion.js'
import { Icon } from './Sprite.jsx'

const ART = {
  taste: (
    <svg className="promise__art" viewBox="0 0 240 240" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinejoin="round" strokeLinecap="round">
        <path d="M50 70h140v84H50z" />
        <path d="M50 112h140M96 70v84M144 70v84" />
        <path d="M70 154c0 18 6 30 10 30s10-12 10-30M150 154c0 26 6 44 12 44s12-18 12-44" />
        <circle cx="120" cy="40" r="10" />
        <path d="M120 18v4M120 58v4M98 40h4M138 40h4" />
      </g>
    </svg>
  ),
  quality: (
    <svg className="promise__art" viewBox="0 0 240 240" aria-hidden="true">
      <defs>
        <path id="seal-path" d="M120 120m-74 0a74 74 0 1 1 148 0a74 74 0 1 1-148 0" />
      </defs>
      <g fill="none" stroke="currentColor" strokeWidth="3.6">
        <circle cx="120" cy="120" r="96" />
        <circle cx="120" cy="120" r="56" />
        <path d="M120 86c14 9 18 21 18 34s-4 25-18 34c-14-9-18-21-18-34s4-25 18-34Zm0 0v68M110 102l10 6 10-6M110 120l10 6 10-6M110 138l10 6 10-6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <text fontSize="13" letterSpacing="4.2" fill="currentColor" fontFamily="Archivo Variable, sans-serif" fontWeight="700">
        <textPath href="#seal-path">PREMIUM QUALITY · CHOCOLATE · PREMIUM QUALITY ·</textPath>
      </text>
    </svg>
  ),
  price: (
    <svg className="promise__art" viewBox="0 0 240 240" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinejoin="round" strokeLinecap="round">
        <path d="M120 34v170M60 204h120" />
        <path d="M48 70h144" />
        <path d="M48 70 22 132h52L48 70ZM192 70l-26 62h52l-26-62Z" />
        <path d="M22 132c0 14 12 22 26 22s26-8 26-22M166 132c0 14 12 22 26 22s26-8 26-22" />
        <circle cx="120" cy="34" r="8" />
      </g>
    </svg>
  ),
  flavours: (
    <div className="promise__trio" aria-hidden="true">
      <Icon id="date" />
      <Icon id="pistachio" />
      <Icon id="almond" />
    </div>
  ),
}

const PROMISES = [
  { key: 'taste', title: 'Better taste.', body: 'Flavour comes first. Every bar is made to be remembered.' },
  { key: 'quality', title: 'Better quality.', body: 'Carefully chosen ingredients and a careful process, from the first batch to the last.' },
  { key: 'price', title: 'Better price.', body: 'Great chocolate should not be a luxury you think twice about.' },
  { key: 'flavours', title: 'Attractive flavours.', body: 'Familiar tastes from our region, shaped into something new and exciting.' },
]

/**
 * Our four promises as a deck of cards that dock on top of each other while you scroll; each docked
 * card keeps its title strip visible. Compact: the card is only as tall as its content.
 */
export default function Promises() {
  const ref = useRef(null)
  useEffect(() => {
    if (env.reduce) return
    const root = ref.current
    const mm = gsap.matchMedia()
    // equal card heights, so the docked deck leaves as one piece
    const stack = root.querySelector('.promises__stack')
    const equalise = () => {
      stack.style.removeProperty('--card-h')
      const h = Math.max(...[...root.querySelectorAll('.promise__card')].map((c) => c.offsetHeight))
      stack.style.setProperty('--card-h', `${h}px`)
    }
    equalise()
    const ro = new ResizeObserver(() => requestAnimationFrame(equalise))
    ro.observe(stack)
    const ctx = gsap.context(() => {
      const items = [...root.querySelectorAll('.promise')]
      items.forEach((li, i) => {
        const card = li.querySelector('.promise__card')
        const next = items[i + 1]
        if (next)
          mm.add('(min-width: 901px)', () => {
            gsap.to(card, { scale: 0.97 + i * 0.006, ease: 'none', scrollTrigger: { trigger: next, start: 'top 85%', end: 'top 40%', scrub: true } })
            // nothing gets sliced: everything below the title strip fades before the next card covers it
            // measured from the docked position: fade starts when the next card reaches this card's bottom
            const dockTop = () => parseFloat(getComputedStyle(li).top) || 0
            const strip = () => (parseFloat(getComputedStyle(next).top) || 0) - dockTop()
            gsap.to(card.querySelectorAll('.promise__body, .promise__num, .promise__art, .promise__trio'), {
              autoAlpha: 0,
              ease: 'none',
              scrollTrigger: { trigger: next, start: () => `top ${dockTop() + card.offsetHeight + 170}px`, end: () => `top ${dockTop() + card.offsetHeight + 4}px`, scrub: true, invalidateOnRefresh: true },
            })
          })
        const paths = card.querySelectorAll('.promise__art path, .promise__art circle')
        paths.forEach((p) => {
          const l = p.getTotalLength ? p.getTotalLength() : 300
          p.style.strokeDasharray = l
          p.style.strokeDashoffset = l
        })
        const tl = gsap.timeline({ scrollTrigger: { trigger: li, start: 'top bottom-=8%' } })
        tl.from(card.querySelector('.promise__num'), { yPercent: 40, opacity: 0, duration: 1.2, ease: 'expo.out' })
        if (paths.length) tl.to(paths, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.05 }, 0.2)
        const pops = card.querySelectorAll('.promise__art text, .promise__trio svg')
        if (pops.length) tl.from(pops, { opacity: 0, scale: 0.6, transformOrigin: '50% 50%', duration: 1, stagger: 0.1, ease: 'back.out(2)' }, 0.4)
      })
    }, root)
    return () => {
      ro.disconnect()
      ctx.revert()
      mm.revert()
    }
  }, [])

  return (
    <section className="promises" id="promises" ref={ref} aria-labelledby="promises-title">
      <div className="wrap">
        <header className="promises__head rv">
          <p className="label">
            <span className="label__num">04</span>What you can count on
          </p>
          <h2 className="promises__title" id="promises-title">
            <span className="serif-i">Our</span> <span className="display">four promises</span>
          </h2>
        </header>
        <ol className="promises__stack">
          {PROMISES.map((p, i) => (
            <li key={p.key} className={`promise promise--${i + 1}`} style={{ '--i': i }}>
              <article className="promise__card">
                <div className="promise__head">
                  <span className="promise__idx label" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="promise__title serif-i">{p.title}</h3>
                </div>
                <p className="promise__body">{p.body}</p>
                <span className="promise__num display" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {ART[p.key]}
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
