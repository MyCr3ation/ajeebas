import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, env } from '../lib/motion.js'
import { archD, latticeTile, archOutline } from '../lib/arch.js'
import { ChocolatePour } from '../lib/pour.js'
import { useCountdown } from '../lib/countdown.js'
import MeltTitle from './MeltTitle.jsx'
import { onReady } from './Intro.jsx'

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const smooth = (t) => t * t * (3 - 2 * t)
const POUCH_RATIO = 1341 / 896

const TITLE = [[['Chocolate,']], [['the '], ['Emirati', true]], [['way.']]]

/**
 * Prologue. An espresso veil with an arch-shaped window (the emblem's arch, with its gold lattice band).
 * Molten chocolate pours from the finial and runs down behind the Almond (Dark) pouch. Scrolling pushes the camera
 * through the arch into the cream world where the dates line up.
 */
export default function Hero() {
  const ref = useRef(null)
  const cd = useCountdown()

  useEffect(() => {
    const hero = ref.current
    const $ = (s) => hero.querySelector(s)
    const stage = $('.hero__stage')
    const veil = $('.hero__veil')
    const g = $('.hero__veil-g')
    const fill = $('.hero__veil-fill')
    const band = $('.hero__veil-band')
    const outer = $('.hero__veil-line--outer')
    const inner = $('.hero__veil-line--inner')
    const glow = veil.querySelector('#veilGlow')
    const pattern = veil.querySelector('#veilLattice')
    const products = $('.hero__products')
    const pl = $('.hero__pouch--l')
    const pr = $('.hero__pouch--r')
    const pc = $('.hero__pouch--c')
    const left = $('.hero__left')
    const right = $('.hero__right')
    const caption = $('.hero__caption')
    const hint = $('.hero__scroll')
    const floor = $('.hero__floor')
    const niche = $('.hero__niche')
    const canvas = $('.hero__pour')
    const fallback = $('.hero__stream-fallback')
    const motion = !env.reduce

    const tile = latticeTile(10)
    pattern.setAttribute('width', tile.W)
    pattern.setAttribute('height', tile.H)
    pattern.innerHTML = `<path d="${tile.d}" fill="none" stroke="#BD9D28" stroke-width="2.2" stroke-linejoin="round"/>`

    const nicheLines = archOutline(niche, [{ inset: -12, top: -18, bottom: 0, width: 1.2 }, { inset: 10, top: 14, bottom: 0, width: 0.7, opacity: 0.6 }], 'niche-line', niche.parentElement)

    // the stream falls behind the Almond (Dark) pouch and carries on into the pour printed on it
    const pour = new ChocolatePour(canvas, { behind: true })
    if (!pour.ok) hero.classList.add('no-gl')

    let geo = null
    const cur = { yJ: 0, ps: 1, pour: motion ? 0 : 1, t: 0 }
    let tone = 'dark'

    function measure() {
      const vw = stage.clientWidth
      const vh = stage.clientHeight
      const mobile = vw < 900
      const header = 76
      let aw, at, ab
      if (mobile) {
        aw = Math.min(vw * 0.62, vh * 0.32, 300)
        at = header + 8
        ab = at + aw * 1.45
      } else {
        aw = Math.min(vw * 0.29, vh * 0.56, 420)
        at = vh * 0.14
        ab = vh * 0.88
      }
      const pw = aw * 0.62
      hero.style.setProperty('--aw', `${aw}px`)
      hero.style.setProperty('--at', `${at}px`)
      hero.style.setProperty('--ab', `${ab}px`)
      hero.style.setProperty('--pw', `${pw}px`)

      const cx = vw / 2
      const b = aw * 0.07
      const innerD = archD(cx - aw / 2, at, aw, ab - at)
      const ow = aw + b * 2
      const outerD = archD(cx - ow / 2, at - b * 1.5, ow, ab - at + b * 1.5)
      veil.setAttribute('viewBox', `0 0 ${vw} ${vh}`)
      fill.setAttribute('d', `M-40,-40 H${vw + 40} V${vh + 40} H-40 Z ${innerD}`)
      band.setAttribute('d', `${outerD} ${innerD}`)
      outer.setAttribute('d', outerD)
      inner.setAttribute('d', innerD)
      glow.setAttribute('cx', cx)
      glow.setAttribute('cy', (at + ab) / 2)
      glow.setAttribute('r', Math.max(vw, vh) * 0.62)
      pattern.setAttribute('patternTransform', `translate(${cx} ${at}) scale(${Math.max(0.32, aw / 1300)})`)

      const fx = cx
      const fy = at + (ab - at) * (mobile ? 0.3 : 0.5)
      const shoulder = at + 0.56 * aw
      const sNeeded = Math.max((fx + 40) / (aw / 2), (fy + 40) / Math.max(fy - shoulder, 1), (vh + 40 - fy) / Math.max(ab - fy, 1))
      geo = {
        vw,
        vh,
        cx,
        fx,
        fy,
        smax: sNeeded * 1.08,
        aw,
        pw,
        at,
        ab,
        mobile,
        dropY: mobile ? Math.max(0, vh * 0.8 - ab) : 0,
        grow: mobile ? 0.22 : Math.min(0.5, (vh * 0.6) / (pw * POUCH_RATIO) - 1),
      }
      pour.resize(vw, vh)
    }

    function drawPour(dt = 0.016) {
      if (!geo) return
      if (pour.ok) {
        pour.frame({ cx: geo.cx, yJ: cur.yJ, size: geo.pw * cur.ps, pour: cur.pour, t: cur.t, dt, still: !motion })
      } else {
        fallback.style.cssText = `left:${geo.cx}px;height:${(cur.yJ + geo.pw * cur.ps * 0.3) * cur.pour}px;width:${geo.pw * cur.ps * 0.08}px`
      }
    }

    measure()
    hero.classList.add('veil-ready')

    let progress = 0
    function render(p) {
      progress = p
      if (!geo) return
      const pcopy = clamp(p / 0.2)
      const pz = smooth(clamp((p - 0.05) / 0.72))
      const s = Math.pow(geo.smax, pz)
      g.setAttribute('transform', `translate(${geo.fx} ${geo.fy}) scale(${s}) translate(${-geo.fx} ${-geo.fy})`)
      band.style.opacity = 1 - clamp((s - 1) / 2.4)
      outer.style.opacity = inner.style.opacity = 1 - clamp((s - 1) / 6)
      const shift = geo.mobile ? 0.05 : 0.12
      gsap.set(left, { x: -pcopy * geo.vw * shift, autoAlpha: 1 - pcopy * 1.15 })
      gsap.set(right, { x: pcopy * geo.vw * shift, autoAlpha: 1 - pcopy * 1.15 })
      hint.style.opacity = 1 - clamp(pcopy * 2.5)
      const spread = pz * (geo.mobile ? 0.45 : 0.6)
      gsap.set(pl, { xPercent: -62 - 50 * spread, rotation: -5 + 2 * spread })
      gsap.set(pr, { xPercent: 62 + 50 * spread, rotation: 5 - 2 * spread })
      const dy = geo.dropY * pz
      const ps = 1 + geo.grow * pz
      gsap.set(products, { y: dy, scale: ps, transformOrigin: '50% 100%' })
      gsap.set(floor, { y: dy })
      niche.style.opacity = 0.35 + 0.65 * pz
      gsap.set([niche, nicheLines.svg], { y: dy })
      // where the pour meets the pack this frame (the printed pour starts at the hang slot)
      const bottom = geo.ab - geo.pw * 0.04 + dy
      const pouchH = geo.pw * POUCH_RATIO * ps
      cur.yJ = bottom - pouchH + pouchH * 0.05
      cur.ps = ps
      caption.style.opacity = clamp((p - 0.74) / 0.14)
      const next = p > 0.6 ? 'light' : 'dark'
      if (next !== tone) {
        tone = next
        hero.dataset.header = tone
        window.dispatchEvent(new Event('ajeebas:tone'))
      }
      if (!motion) drawPour()
    }

    const triggers = []
    let tick = null
    if (motion) {
      triggers.push(
        ScrollTrigger.create({
          trigger: hero,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self) => render(self.progress),
          onRefresh: (self) => {
            measure()
            render(self.progress)
          },
        })
      )
      // keep the chocolate moving only while the prologue is on screen
      let live = true
      triggers.push(ScrollTrigger.create({ trigger: hero, start: 'top bottom', end: 'bottom top', onToggle: (self) => (live = self.isActive) }))
      let last = 0
      tick = (time) => {
        const dt = Math.min(time - last, 0.05)
        last = time
        if (!live) return
        cur.t = time
        drawPour(dt)
      }
      gsap.ticker.add(tick)
    }
    const onResize = () => {
      measure()
      render(progress)
    }
    if (!motion) window.addEventListener('resize', onResize)
    render(0)

    // opening move once the curtain lifts: lines draw, chocolate pours, the dates arrive
    let introTl = null
    const offReady = onReady(() => {
      if (!motion) return
      const lines = [outer, inner]
      lines.forEach((l) => {
        l.setAttribute('pathLength', '1')
        l.style.strokeDasharray = '1'
      })
      pour.reset()
      introTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      introTl
        .fromTo(lines, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', stagger: 0.15 }, 0)
        .fromTo(band, { opacity: 0 }, { opacity: 1, duration: 1.2 }, 0.5)
        .fromTo(pc, { yPercent: 10, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1.1 }, 0.2)
        .fromTo(cur, { pour: 0 }, { pour: 1, duration: 1.15, ease: 'power2.in' }, 0.75)
        .fromTo([pl, pr], { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 1.2)
        .from(left.querySelector('.hero__eyebrow'), { y: 20, autoAlpha: 0, duration: 1 }, 0.3)
        .from(right.children, { y: 24, autoAlpha: 0, duration: 1, stagger: 0.1 }, 0.7)
        .add(() => {
          lines.forEach((l) => (l.style.strokeDasharray = ''))
          render(progress)
        })
    })

    return () => {
      offReady()
      introTl?.kill()
      triggers.forEach((t) => t.kill())
      if (tick) gsap.ticker.remove(tick)
      window.removeEventListener('resize', onResize)
      nicheLines.svg.remove()
      pour.destroy()
    }
  }, [])

  return (
    <section className="hero" id="top" ref={ref} aria-labelledby="hero-title" data-header="dark">
      <div className="hero__stage">
        <div className="hero__world">
          <div className="hero__niche" aria-hidden="true">
            <span className="niche__band" />
          </div>
          <div className="hero__floor" aria-hidden="true" />
          <div className="hero__products">
            <img className="hero__pouch hero__pouch--l" src="/images/cut/dates-almond-milk-pouch.webp" width="881" height="1186" alt="Ajeebas Premium Dates Chocolate with Almond (Milk) pouch" fetchPriority="high" />
            <img className="hero__pouch hero__pouch--r" src="/images/cut/dates-pistachio-pouch.webp" width="890" height="1332" alt="Ajeebas Premium Dates Chocolate with Pistachio pouch" fetchPriority="high" />
            <img className="hero__pouch hero__pouch--c" src="/images/cut/dates-almond-dark-pouch.webp" width="896" height="1341" alt="Ajeebas Premium Dates Chocolate with Almond (Dark) pouch, with chocolate pouring over a date" fetchPriority="high" />
          </div>
          <canvas className="hero__pour" aria-hidden="true" />
          <span className="hero__stream-fallback" aria-hidden="true" />
          <p className="hero__caption" aria-hidden="true">
            Dubai Style &middot; Rich &amp; Indulgent
          </p>
        </div>

        <svg className="hero__veil" aria-hidden="true" focusable="false" fill="none">
          <defs>
            <radialGradient id="veilGlow" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1">
              <stop offset="0" stopColor="#4A2C1E" />
              <stop offset="0.55" stopColor="#2B1A12" />
              <stop offset="1" stopColor="#1A100B" />
            </radialGradient>
            <pattern id="veilLattice" patternUnits="userSpaceOnUse" width="60" height="34.641" />
          </defs>
          <g className="hero__veil-g">
            <path className="hero__veil-fill" fill="url(#veilGlow)" fillRule="evenodd" />
            <path className="hero__veil-band" fill="url(#veilLattice)" fillRule="evenodd" />
            <path className="hero__veil-line hero__veil-line--outer" fill="none" stroke="#BD9D28" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            <path className="hero__veil-line hero__veil-line--inner" fill="none" stroke="#BD9D28" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </g>
        </svg>

        <div className="hero__copy">
          <div className="hero__left">
            <p className="hero__eyebrow label">Ajeebas Chocolate &middot; Dubai</p>
            <MeltTitle id="hero-title" className="hero__title" lines={TITLE} label="Chocolate, the Emirati way." hoverScope={ref} />
          </div>
          <div className="hero__right">
            <p className="hero__sub">Made in the UAE, with better taste, better quality, better price and flavours worth talking about.</p>
            <div className="hero__ctas">
              <a className="btn btn--pist" href="#work-with-us">
                <span>Stock Ajeebas</span>
                <svg aria-hidden="true">
                  <use href="#i-arrow" />
                </svg>
              </a>
              <a className="btn btn--line" href="#what-we-make">
                <span>What we make</span>
              </a>
            </div>
            <a className="hero__date" href="#made-in-the-uae">
              <span className="hero__date-label label">Factory opening</span>
              <span className="hero__date-value">23 October 2026</span>
              <span className="hero__date-count">{cd.open ? 'Now open' : `${cd.d} day${cd.d === 1 ? '' : 's'} to go`}</span>
            </a>
          </div>
        </div>
        <p className="hero__scroll" aria-hidden="true">
          <span>Scroll to enter</span>
          <i />
        </p>
      </div>
    </section>
  )
}
