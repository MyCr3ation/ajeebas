import { useEffect } from 'react'
import { ScrollTrigger, initLenis, initAnchors, initReveals } from './lib/motion.js'
import Sprite from './components/Sprite.jsx'
import Intro from './components/Intro.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Bands from './components/Bands.jsx'
import Story from './components/Story.jsx'
import WhatWeMake from './components/WhatWeMake.jsx'
import Products from './components/products/Products.jsx'
import Promises from './components/Promises.jsx'
import Factory from './components/Factory.jsx'
import Leadership from './components/Leadership.jsx'
import Partner from './components/Partner.jsx'
import Footer from './components/Footer.jsx'

initLenis()

export default function App() {
  useEffect(() => {
    const offAnchors = initAnchors()
    const offReveals = initReveals()
    // triggers are created child-first; sort so pinned sections offset the ones after them
    ScrollTrigger.sort()
    ScrollTrigger.refresh()
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => {
      offAnchors()
      offReveals()
      window.removeEventListener('load', refresh)
    }
  }, [])

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Sprite />
      <Intro />
      <Header />
      <main id="main">
        <Hero />
        <Bands />
        <Story />
        <WhatWeMake />
        <Products />
        <Promises />
        <Factory />
        <Leadership />
        <Partner />
      </main>
      <Footer />
    </>
  )
}
