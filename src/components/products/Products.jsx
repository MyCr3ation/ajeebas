import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, env, registerScrollTarget } from '../../lib/motion.js'
import { PANELS } from './data.js'
import EditPanel from './EditPanel.jsx'

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))

/**
 * The collection. On desktop the section pins and your scroll carries you sideways through the five
 * lines, one full-screen panel each (manual: nothing moves between products on its own). Inside a
 * panel, flavours take turns on a timer. On phones and tablets the panels simply stack.
 */
export default function Products() {
  const ref = useRef(null)
  const [active, setActive] = useState(-1)
  const tones = useRef(PANELS.map(() => 'dark'))
  const activeRef = useRef(-1)

  const applyTone = useCallback(() => {
    const el = ref.current
    const i = activeRef.current
    const tone = i >= 0 ? tones.current[i] : 'dark'
    if (el.dataset.header !== tone) {
      el.dataset.header = tone
      window.dispatchEvent(new Event('ajeebas:tone'))
    }
  }, [])
  const toneSetters = useRef(
    PANELS.map((_, i) => (tone) => {
      tones.current[i] = tone
      if (activeRef.current === i) applyTone()
    })
  )

  const setActiveIdx = useCallback(
    (i) => {
      if (activeRef.current === i) return
      activeRef.current = i
      setActive(i)
      applyTone()
    },
    [applyTone]
  )

  useEffect(() => {
    const section = ref.current
    const track = section.querySelector('.products__track')
    const panels = [...section.querySelectorAll('.panel')]
    const bar = section.querySelector('.products__bar b')
    const n = panels.length
    const offs = []
    const mm = gsap.matchMedia()
    let st = null

    if (!env.reduce) {
      mm.add('(min-width: 1024px)', () => {
        section.classList.add('is-horizontal')
        const dist = () => track.scrollWidth - window.innerWidth
        const tween = gsap.to(track, { x: () => -dist(), ease: 'none' })
        let visible = false
        st = ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.6,
          animation: tween,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          snap: { snapTo: 1 / (n - 1), duration: { min: 0.25, max: 0.7 }, delay: 0.12, ease: 'power2.inOut' },
          onUpdate: (self) => {
            const p = self.progress * (n - 1)
            panels.forEach((el, i) => {
              const off = clamp(i - p, -1, 1)
              el.style.setProperty('--off', off.toFixed(4))
              el.style.setProperty('--enter', (1 - Math.abs(off)).toFixed(4))
            })
            gsap.set(bar, { scaleX: self.progress })
            if (visible) setActiveIdx(Math.round(p))
          },
        })
        // a panel counts as "on screen" while the pinned block covers the middle of the viewport
        const vis = ScrollTrigger.create({
          trigger: section.parentElement,
          start: 'top 50%',
          end: 'bottom 50%',
          invalidateOnRefresh: true,
          onToggle: (self) => {
            visible = self.isActive
            section.classList.toggle('is-live', visible)
            setActiveIdx(visible && st ? Math.round(st.progress * (n - 1)) : -1)
          },
        })
        panels.forEach((el, i) => offs.push(registerScrollTarget(el.id, () => (st ? st.start + ((st.end - st.start) * i) / (n - 1) : null))))
        return () => {
          section.classList.remove('is-horizontal', 'is-live')
          st?.kill()
          st = null
          vis.kill()
          tween.kill()
          gsap.set(track, { x: 0 })
          panels.forEach((el) => {
            el.style.removeProperty('--off')
            el.style.removeProperty('--enter')
          })
          offs.splice(0).forEach((off) => off())
        }
      })
    }

    // stacked layout (phones, tablets, reduced motion): the panel nearest the middle of the screen is active
    let io = null
    const stackedMq = window.matchMedia('(max-width: 1023px)')
    const watchStacked = () => {
      io?.disconnect()
      io = null
      if (!stackedMq.matches && !env.reduce) return
      const ratios = new Map()
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => ratios.set(e.target, e.intersectionRatio))
          let best = -1
          let bestR = 0.25
          panels.forEach((p, i) => {
            const r = ratios.get(p) || 0
            if (r > bestR) {
              bestR = r
              best = i
            }
          })
          setActiveIdx(best)
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1] }
      )
      panels.forEach((p) => io.observe(p))
    }
    watchStacked()
    stackedMq.addEventListener('change', watchStacked)

    return () => {
      mm.revert()
      io?.disconnect()
      stackedMq.removeEventListener('change', watchStacked)
    }
  }, [setActiveIdx])

  return (
    <section className="products" id="products" ref={ref} data-header="dark" aria-labelledby="products-title">
      <h2 className="sr-only" id="products-title">
        The collection
      </h2>
      <div className="products__track">
        {PANELS.map((line, i) => (
          <EditPanel key={line.id} line={line} index={i} active={active === i} onTone={toneSetters.current[i]} />
        ))}
      </div>
      <nav className="products__progress" aria-label="The collection">
        <ol>
          {PANELS.map((line, i) => (
            <li key={line.id}>
              <a href={`#${line.id}`} aria-current={active === i ? 'true' : 'false'}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                {line.short}
              </a>
            </li>
          ))}
        </ol>
        <i className="products__bar" aria-hidden="true">
          <b />
        </i>
      </nav>
    </section>
  )
}
