import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, SplitText)

export { gsap, ScrollTrigger, SplitText }

const mq = (q) => typeof window !== 'undefined' && window.matchMedia(q).matches
export const env = {
  reduce: mq('(prefers-reduced-motion: reduce)'),
  fine: mq('(pointer: fine)'),
  get mobile() {
    return window.innerWidth < 900
  },
}

/** one Lenis instance driven by the GSAP ticker (native scrolling when reduced motion is on) */
let lenis = null
export function initLenis() {
  if (env.reduce || lenis) return lenis
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 0.95 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}
export const getLenis = () => lenis

/**
 * Sections that move sideways (the pinned collection) register a resolver so anchor links
 * land on the right scene instead of the section's top.
 */
const resolvers = new Map()
export function registerScrollTarget(id, fn) {
  resolvers.set(id, fn)
  return () => resolvers.delete(id)
}

export function scrollToId(id) {
  const resolver = resolvers.get(id)
  const y = resolver ? resolver() : null
  const el = id === 'top' ? document.body : document.getElementById(id)
  if (y == null && !el) return false
  if (lenis) {
    if (y != null) lenis.scrollTo(y, { duration: 1.6 })
    else lenis.scrollTo(id === 'top' ? 0 : el, { duration: 1.6 })
  } else if (y != null) window.scrollTo({ top: y, behavior: env.reduce ? 'auto' : 'smooth' })
  else if (id === 'top') window.scrollTo({ top: 0 })
  else el.scrollIntoView({ behavior: env.reduce ? 'auto' : 'smooth' })
  // keyboard users: move focus to the heading without jumping
  const target = el && el !== document.body ? el.querySelector('h1, h2, h3') : null
  if (target) {
    target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  }
  return true
}

/** delegated in-page anchor handling (one listener for the whole page) */
export function initAnchors(onNavigate) {
  const onClick = (e) => {
    const a = e.target.closest('a[href^="#"]')
    if (!a) return
    const id = a.getAttribute('href').slice(1)
    if (!id) return
    if (scrollToId(id)) {
      e.preventDefault()
      onNavigate?.(id)
      history.replaceState(null, '', `#${id}`)
    }
  }
  document.addEventListener('click', onClick)
  return () => document.removeEventListener('click', onClick)
}

/** fade-up reveals for anything with .rv (content stays visible without JS / with reduced motion) */
export function initReveals(scope = document) {
  const els = [...scope.querySelectorAll('.rv')]
  if (env.reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'))
    return () => {}
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-in')
          io.unobserve(en.target)
        }
      }),
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
  )
  els.forEach((el) => io.observe(el))
  return () => io.disconnect()
}
