import { useEffect, useRef } from 'react'
import { gsap, SplitText, env } from '../lib/motion.js'
import { Icon } from './Sprite.jsx'

/**
 * Our story: words ink in as you read (scroll-scrubbed), key phrases get a pistachio marker swipe,
 * and little ingredient pictograms pop into the sentence.
 */
export default function Story() {
  const ref = useRef(null)
  useEffect(() => {
    if (env.reduce) return
    const root = ref.current
    let split
    const ctx = gsap.context(() => {
      const paras = root.querySelectorAll('.story__body p')
      split = SplitText.create(paras, { type: 'words', wordsClass: 'word' })
      gsap.fromTo(
        split.words,
        { opacity: 0.14 },
        { opacity: 1, ease: 'none', stagger: 0.12, scrollTrigger: { trigger: root.querySelector('.story__body'), start: 'top 82%', end: 'bottom 62%', scrub: 0.6 } }
      )
      root.querySelectorAll('.hl').forEach((hl) => {
        gsap.fromTo(hl, { '--hl': '0%' }, { '--hl': '100%', duration: 1.1, ease: 'power3.inOut', scrollTrigger: { trigger: hl, start: 'top 66%', toggleActions: 'play none none reverse' } })
      })
      root.querySelectorAll('.story__body .inl').forEach((icon) => {
        gsap.from(icon, { scale: 0, rotate: -50, duration: 1, ease: 'back.out(3)', scrollTrigger: { trigger: icon, start: 'top 78%' } })
      })
      gsap.from(root.querySelectorAll('.story__pics svg'), { y: 30, opacity: 0, rotate: -30, stagger: 0.1, duration: 1, ease: 'back.out(2)', scrollTrigger: { trigger: root.querySelector('.story__aside'), start: 'top 75%' } })
    }, root)
    return () => {
      ctx.revert()
      split?.revert()
    }
  }, [])

  return (
    <section className="story wrap" id="our-story" ref={ref} aria-labelledby="story-title">
      <div className="story__aside">
        <p className="label">
          <span className="label__num">01</span>About us
        </p>
        <h2 className="story__title display" id="story-title">
          Our story
        </h2>
        <div className="story__pics" aria-hidden="true">
          <Icon id="date" />
          <Icon id="almond" />
          <Icon id="pistachio" />
        </div>
      </div>
      <div className="story__body">
        <p>
          Dates
          <Icon id="date" className="inl" />, nuts
          <Icon id="almond" className="inl" /> and sweet kunafa have always been part of <span className="nowrap">
            <span className="hl">Emirati hospitality</span>.
          </span> They are what you put in front of a guest to say welcome. In recent years, that same spirit found a new form in the world's favourite treat, and <span className="nowrap"><span className="hl">"Dubai chocolate"</span></span> became a global craze.
        </p>
        <p>
          We saw something we wanted to build on. We love the idea, and we believe it can be made better: <span className="hl">richer in taste, finer in quality, and fairer in </span>
          <span className="nowrap">
            <span className="hl">price</span>,
          </span>{' '}
          so more people can enjoy it.
        </p>
        <p>
          That is why Ajeebas Chocolate was born. We are building a factory in Dubai to make chocolate the way we think it should be made, and we open our doors on{' '}
          <span className="nowrap">
            <span className="hl hl--strong">23 October 2026</span>.
          </span>
        </p>
      </div>
    </section>
  )
}
