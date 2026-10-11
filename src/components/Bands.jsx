import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, env } from '../lib/motion.js'

const STAR = (
  <svg aria-hidden="true">
    <use href="#i-star" />
  </svg>
)
const TAPES = [
  { tone: 'cocoa', dir: -1, items: ['Almond Dark', 'Almond Milk', 'Pistachio', 'Assorted', 'Crunch Stick', 'Kunafa Bar', 'Coconut Truffle'] },
  { tone: 'pist', dir: 1, items: ['Dubai Style', 'Rich & Indulgent', 'Premium Quality Chocolate', 'Made in UAE', 'Little bite of happiness', 'No Artificial Flavours'] },
]

function Set({ items, italicFirst }) {
  return (
    <span className="band__set">
      {items.map((t, i) => {
        const italic = (i % 2 === 0) === italicFirst
        return (
          <span key={t} className="band__item">
            {italic ? <i>{t}</i> : <b>{t}</b>}
            {STAR}
          </span>
        )
      })}
    </span>
  )
}

/**
 * Two crossing flavour tapes. They drift on their own, speed up with scroll velocity and flip
 * direction when you scroll back up.
 */
export default function Bands() {
  const ref = useRef(null)
  useEffect(() => {
    const root = ref.current
    const bands = [...root.querySelectorAll('.band')]
    const clones = []
    bands.forEach((band) => {
      const track = band.querySelector('.band__track')
      const set = track.querySelector('.band__set')
      let guard = 0
      while (track.scrollWidth < window.innerWidth * 2.6 && guard++ < 12) {
        const c = set.cloneNode(true)
        track.appendChild(c)
        clones.push(c)
      }
    })
    if (env.reduce) return () => clones.forEach((c) => c.remove())
    let velocity = 0
    let dir = 1
    let visible = true
    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => (visible = self.isActive),
      onUpdate: (self) => {
        velocity = Math.abs(self.getVelocity())
        dir = self.direction
      },
    })
    const state = bands.map((band) => {
      const track = band.querySelector('.band__track')
      const set = track.querySelector('.band__set')
      return { track, set, w: set.getBoundingClientRect().width, x: 0, d: +band.dataset.dir || 1 }
    })
    const onResize = () => state.forEach((s) => (s.w = s.set.getBoundingClientRect().width))
    window.addEventListener('resize', onResize)
    document.fonts?.ready.then(onResize)
    const tick = (time, delta) => {
      velocity *= 0.92
      if (!visible) return
      const k = (delta / 16.67) * (0.55 + Math.min(velocity / 380, 7))
      state.forEach((s) => {
        s.x += s.d * dir * k
        if (s.x <= -s.w) s.x += s.w
        if (s.x > 0) s.x -= s.w
        s.track.style.transform = `translate3d(${s.x}px,0,0)`
      })
    }
    gsap.ticker.add(tick)
    return () => {
      st.kill()
      gsap.ticker.remove(tick)
      window.removeEventListener('resize', onResize)
      clones.forEach((c) => c.remove())
    }
  }, [])

  return (
    <div className="bands" ref={ref} aria-hidden="true">
      {TAPES.map((t, i) => (
        <div key={t.tone} className={`band band--${t.tone}`} data-dir={t.dir}>
          <div className="band__track">
            <Set items={t.items} italicFirst={i === 1} />
          </div>
        </div>
      ))}
    </div>
  )
}
