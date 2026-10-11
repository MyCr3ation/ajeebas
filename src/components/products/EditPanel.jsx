import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, env } from '../../lib/motion.js'
import { Icon } from '../Sprite.jsx'

// orbit slots around the pack: left %, top %, size (px at desktop), rotation
const SLOTS = [
  [14, 12, 70, -22],
  [66, 6, 54, 28],
  [8, 58, 62, 16],
  [74, 62, 78, -24],
  [26, 84, 50, 40],
  [58, 90, 58, -12],
]
const AUTO = 4.6 // seconds per flavour

/**
 * "The ___ edit": a product line presented one flavour at a time. The whole panel repaints in the
 * flavour's colours, the pack turns like a page, the giant vertical word tumbles and the ingredients
 * burst out and drop back in. A timer moves to the next flavour while the panel is on screen; choosing
 * a flavour (or pausing) stops it.
 */
export default function EditPanel({ line, index, active, onTone }) {
  const ref = useRef(null)
  const [current, setCurrent] = useState(0)
  const [shown, setShown] = useState(0)
  const [paused, setPaused] = useState(false)
  const busy = useRef(false)
  const queued = useRef(null)
  const curRef = useRef(0)
  const v = line.variants[shown]
  const vc = line.variants[current]

  useEffect(() => {
    if (active) onTone?.(vc.tone)
  }, [active, vc.tone, onTone])

  // the entrance of the ingredients for whatever flavour is shown
  useEffect(() => {
    const ings = ref.current.querySelectorAll('.edit__orbit svg')
    if (env.reduce) return
    const tweens = []
    gsap.set(ings, { rotation: (i, el) => +el.dataset.rot })
    tweens.push(gsap.from(ings, { scale: 0, opacity: 0, y: -40, duration: 0.9, ease: 'back.out(2.4)', stagger: 0.06 }))
    ings.forEach((el, i) =>
      tweens.push(gsap.to(el, { y: gsap.utils.random(-14, 14), rotation: +el.dataset.rot + gsap.utils.random(-14, 14), duration: gsap.utils.random(2.4, 3.8), ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.9 + i * 0.1 }))
    )
    return () => tweens.forEach((t) => t.kill())
  }, [shown])

  // the visual change runs one at a time; the newest choice wins if several arrive mid-change
  const shownRef = useRef(0)
  const animateTo = useCallback((k) => {
    if (busy.current) {
      queued.current = k
      return
    }
    if (k === shownRef.current) return
    shownRef.current = k
    const root = ref.current
    if (env.reduce) {
      setShown(k)
      return
    }
    busy.current = true
    const media = root.querySelector('.edit__media')
    const name = root.querySelector('.edit__name')
    const letters = root.querySelectorAll('.edit__letters span')
    const ings = root.querySelectorAll('.edit__orbit svg')
    const tl = gsap.timeline({
      onComplete: () => {
        busy.current = false
        const q = queued.current
        queued.current = null
        if (q != null && q !== shownRef.current) animateTo(q)
      },
    })
    tl.to(media, { rotationY: 90, x: -30, duration: 0.38, ease: 'power2.in' }, 0)
      .to(name, { yPercent: -60, opacity: 0, duration: 0.3, ease: 'power2.in' }, 0)
      .to(ings, { scale: 0, opacity: 0, x: () => gsap.utils.random(-80, 80), y: () => gsap.utils.random(-60, 60), duration: 0.4, ease: 'power2.in', stagger: 0.03 }, 0)
      .fromTo(letters, { rotationX: 0 }, { rotationX: 360, duration: 1, ease: 'expo.inOut', stagger: 0.05 }, 0)
      .add(() => setShown(k), 0.4)
      .fromTo(media, { rotationY: -90, x: 30 }, { rotationY: 0, x: 0, duration: 0.9, ease: 'back.out(1.5)', immediateRender: false }, 0.42)
      .fromTo(name, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, ease: 'expo.out', immediateRender: false }, 0.42)
      .fromTo(root.querySelector('.edit__script'), { clipPath: 'inset(-20% 100% -20% 0)' }, { clipPath: 'inset(-20% 0% -20% 0)', duration: 0.9, ease: 'power2.inOut' }, 0.4)
  }, [])

  // the selection (tabs, focus, colours) changes at once; the pack follows
  const select = useCallback(
    (k, { user = false, focus = false } = {}) => {
      // choosing a flavour pauses the timer; the play button can restart it
      if (user) setPaused(true)
      curRef.current = k
      setCurrent(k)
      if (focus) ref.current.querySelectorAll('.ftab')[k]?.focus()
      animateTo(k)
    },
    [animateTo]
  )

  // timer: runs only while this panel is the one on screen
  const barTween = useRef(null)
  useEffect(() => {
    const bars = ref.current.querySelectorAll('.ftab__bar')
    gsap.set(bars, { scaleX: 0 })
    if (env.reduce || paused || !active || line.variants.length < 2) return
    const bar = bars[current]
    barTween.current = gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: AUTO, ease: 'none', onComplete: () => select((current + 1) % line.variants.length) })
    return () => barTween.current?.kill()
  }, [current, paused, active, select, line.variants.length])

  // gentle 3D tilt that follows the pointer (desktop)
  useEffect(() => {
    if (!env.fine || env.reduce) return
    const stage = ref.current.querySelector('.edit__stage')
    const pack = ref.current.querySelector('.edit__pack')
    gsap.set(pack, { transformPerspective: 1200 })
    const rx = gsap.quickTo(pack, 'rotationX', { duration: 0.8, ease: 'power3' })
    const ry = gsap.quickTo(pack, 'rotationY', { duration: 0.8, ease: 'power3' })
    const move = (e) => {
      const r = stage.getBoundingClientRect()
      ry(((e.clientX - r.left) / r.width - 0.5) * 18)
      rx(-((e.clientY - r.top) / r.height - 0.5) * 12)
    }
    const leave = () => {
      rx(0)
      ry(0)
    }
    stage.addEventListener('pointermove', move)
    stage.addEventListener('pointerleave', leave)
    return () => {
      stage.removeEventListener('pointermove', move)
      stage.removeEventListener('pointerleave', leave)
    }
  }, [])

  const onKey = (e, i) => {
    const n = line.variants.length
    let k = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') k = (i + 1) % n
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') k = (i - 1 + n) % n
    if (e.key === 'Home') k = 0
    if (e.key === 'End') k = n - 1
    if (k !== null) {
      e.preventDefault()
      select(k, { user: true, focus: true })
    }
  }

  const tabId = (i) => `${line.id}-tab-${i}`
  const mobile = typeof window !== 'undefined' && window.innerWidth < 900

  return (
    <article className={`panel edit edit--${line.id.replace('line-', '')}`} id={line.id} ref={ref} data-variant={vc.key} data-tone={vc.tone} aria-labelledby={`${line.id}-title`}>
      <div className="edit__inner wrap">
        <div className="edit__copy">
          <p className="label">
            <span className="label__num">{String(index + 1).padStart(2, '0')}</span>
            {line.label}
          </p>
          <h3 className="edit__title" id={`${line.id}-title`}>
            <span className="serif-i">{line.titleItalic}</span> <span className="display">{line.titleCaps}</span>
          </h3>
          <div className="edit__panel" id={`${line.id}-panel`} role="tabpanel" aria-labelledby={tabId(current)} tabIndex={0}>
            <p className="edit__style label">{line.style}</p>
            <p className="edit__name serif" aria-live="polite">
              {v.name}
            </p>
            <p className="edit__script script">{v.soon ? 'Coming soon' : line.script}</p>
            {line.claimsLabel && !v.soon && <p className="edit__claims-label label">{line.claimsLabel}</p>}
            {!v.soon && (
              <ul className="edit__claims">
                {line.claims.map(([icon, text]) => (
                  <li key={text}>
                    <Icon id={icon} />
                    {text}
                  </li>
                ))}
              </ul>
            )}
            {line.foot && <p className="edit__foot label">{line.foot}</p>}
          </div>
        </div>

        <div className="edit__stage">
          <p className="edit__letters" aria-hidden="true">
            {[...line.letters].map((ch, i) => (
              <span key={i}>{ch}</span>
            ))}
          </p>
          <div className="edit__orbit" aria-hidden="true" key={v.key}>
            {v.ings.map((id, i) => {
              const [l, t, size, rot] = SLOTS[i]
              const s = mobile ? size * 0.72 : size
              return (
                <svg key={i} data-rot={rot} style={{ left: `${l}%`, top: `${t}%`, width: s, height: s }}>
                  <use href={`#i-${id}`} />
                </svg>
              )
            })}
          </div>
          <div className="edit__pack">
            <div className={`edit__media${v.wide ? ' is-wide' : ''}${v.extra ? ' has-extra' : ''}`}>
              {v.soon ? (
                <div className="edit__soon">
                  <svg className="edit__soon-star" aria-hidden="true">
                    <use href="#i-star" />
                  </svg>
                  <p>
                    <span className="display">More</span> <span className="serif-i">flavours</span> <span className="display">soon</span>
                  </p>
                </div>
              ) : (
                <>
                  <img className="edit__img" src={v.img} width={v.w} height={v.h} alt={v.alt} loading="lazy" decoding="async" />
                  {v.extra && <img className="edit__extra" src={v.extra.img} width={v.extra.w} height={v.extra.h} alt={v.extra.alt} loading="lazy" decoding="async" />}
                </>
              )}
            </div>
            <span className="edit__shadow" aria-hidden="true" />
          </div>
        </div>

        <div className="edit__controls">
          <div className="edit__tabs" role="tablist" aria-label={`Choose a ${line.label.toLowerCase()} flavour`}>
            {line.variants.map((x, i) => (
              <button
                key={x.key}
                className="ftab"
                role="tab"
                id={tabId(i)}
                type="button"
                aria-selected={i === current}
                aria-controls={`${line.id}-panel`}
                tabIndex={i === current ? 0 : -1}
                onClick={() => select(i, { user: true })}
                onKeyDown={(e) => onKey(e, i)}
              >
                <span className="ftab__sw" style={{ background: x.swatch }} aria-hidden="true" />
                <span className="ftab__n">{String(i + 1).padStart(2, '0')}</span>
                {x.tab}
                <span className="ftab__bar" aria-hidden="true" />
              </button>
            ))}
          </div>
          {!env.reduce && line.variants.length > 1 && (
            <button className="edit__play" type="button" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
              <span className="sr-only">{paused ? 'Play automatic flavour rotation' : 'Pause automatic flavour rotation'}</span>
              <span className="edit__play-ico" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
