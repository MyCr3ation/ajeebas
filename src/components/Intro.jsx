import { useEffect, useRef, useState } from 'react'
import { gsap, env, getLenis } from '../lib/motion.js'
import { parts, VB } from '../lib/logo.js'

/** tell the page the curtain is up (late listeners can read the flag) */
export function signalReady() {
  if (window.__ajeebasReady) return
  window.__ajeebasReady = true
  window.dispatchEvent(new Event('ajeebas:ready'))
}
export function onReady(fn) {
  if (window.__ajeebasReady) {
    fn()
    return () => {}
  }
  window.addEventListener('ajeebas:ready', fn, { once: true })
  return () => window.removeEventListener('ajeebas:ready', fn)
}

/**
 * Opening titles. The emblem draws itself in gold line-work over espresso, its lattice fills,
 * the wordmark rises. Then the two halves of the logo fly up into their places in the navbar
 * while the curtain lifts and the page fades in. About 3.4s; any key, click, wheel or touch skips it.
 */
export default function Intro() {
  const ref = useRef(null)
  const [gone, setGone] = useState(env.reduce)

  useEffect(() => {
    const root = document.documentElement
    if (env.reduce) {
      signalReady()
      return
    }
    const el = ref.current
    const lenis = getLenis()
    root.classList.add('is-intro', 'is-intro-brand')
    lenis?.stop()
    window.scrollTo(0, 0)

    const q = (s) => el.querySelector(s)
    const bg = q('.intro__bg')
    const emblemSvg = q('.intro__emblem')
    const wordSvg = q('.intro__word')
    const divider = q('.intro__divider')
    const emblemPaths = emblemSvg.querySelectorAll('path')
    const wordPaths = wordSvg.querySelectorAll('[data-part="wordmark"] path')
    const tagline = wordSvg.querySelector('[data-part="tagline"]')
    const flourish = wordSvg.querySelector('[data-part="flourish"]')

    emblemPaths.forEach((p) => {
      p.setAttribute('pathLength', '1')
      Object.assign(p.style, { stroke: 'currentColor', strokeWidth: '0.8', strokeDasharray: '1', strokeDashoffset: '1', fillOpacity: '0' })
    })

    let finished = false
    const target = (sel) => document.querySelector(`.nav ${sel}`)?.getBoundingClientRect()

    function fly() {
      if (finished) return
      finished = true
      removeSkip()
      root.classList.remove('is-intro')
      lenis?.start()
      signalReady()
      const tE = target('.brand__emblem')
      const tW = target('.brand__wordmark')
      const tl = gsap.timeline({
        onComplete: () => {
          // the navbar logo fades in underneath the identical flying one, then the overlay goes
          root.classList.remove('is-intro-brand')
          setTimeout(() => setGone(true), 900)
        },
      })
      const toRect = (node, t) => {
        if (!t || !t.width) return { autoAlpha: 0 }
        const r = node.getBoundingClientRect()
        const s = t.width / r.width
        return { x: `+=${t.left - r.left}`, y: `+=${t.top - r.top}`, scale: s }
      }
      gsap.set([emblemSvg, wordSvg], { transformOrigin: '0 0' })
      tl.to(divider, { autoAlpha: 0, scaleX: 0.4, duration: 0.45, ease: 'power2.in' }, 0)
        .to(el.querySelector('.intro__skip'), { autoAlpha: 0, duration: 0.25 }, 0)
        .to(emblemSvg, { ...toRect(emblemSvg, tE), duration: 1.1, ease: 'expo.inOut' }, 0.05)
        .to(wordSvg, { ...toRect(wordSvg, tW), duration: 1.1, ease: 'expo.inOut' }, 0.05)
        .to(bg, { autoAlpha: 0, duration: 0.85, ease: 'power2.inOut' }, 0.3)
    }

    const tl = gsap.timeline({ onComplete: fly })
    tl.to(emblemPaths, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut', stagger: 0.03 }, 0.1)
      .to(emblemPaths, { fillOpacity: 1, strokeWidth: 0, duration: 0.5, ease: 'power1.out' }, 0.9)
      .from(divider, { scaleX: 0, transformOrigin: '50% 50%', duration: 0.6, ease: 'power3.inOut' }, 0.95)
      .from(wordPaths, { y: 26, autoAlpha: 0, duration: 0.6, ease: 'power3.out', stagger: 0.04 }, 1.1)
      .from(tagline, { autoAlpha: 0, y: 10, duration: 0.5, ease: 'power2.out' }, 1.4)
      .from(flourish, { autoAlpha: 0, scale: 0.6, transformOrigin: '50% 0%', duration: 0.5, ease: 'power2.out' }, 1.5)
      .to({}, { duration: 0.3 })

    const skip = (e) => {
      if (e?.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) return
      tl.progress(1)
    }
    const evs = ['keydown', 'wheel', 'touchstart', 'pointerdown']
    evs.forEach((t) => window.addEventListener(t, skip, { passive: true }))
    function removeSkip() {
      evs.forEach((t) => window.removeEventListener(t, skip))
    }
    return () => {
      removeSkip()
      tl.kill()
      root.classList.remove('is-intro', 'is-intro-brand')
    }
  }, [])

  if (gone) return null
  return (
    <div className="intro" ref={ref} aria-hidden="true">
      <div className="intro__bg">
        <p className="intro__skip label">Click or scroll to skip</p>
      </div>
      <div className="intro__lockup">
        <svg className="intro__emblem" viewBox={VB.emblem.join(' ')} fill="currentColor" dangerouslySetInnerHTML={{ __html: parts.emblem }} />
        <svg className="intro__divider" viewBox={VB.logo.join(' ')} fill="currentColor" dangerouslySetInnerHTML={{ __html: parts.divider }} />
        <svg className="intro__word" viewBox={VB.wordmark.join(' ')} fill="currentColor" dangerouslySetInnerHTML={{ __html: parts.wordmark }} />
      </div>
    </div>
  )
}
