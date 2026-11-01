import { parts, VB } from '../lib/logo.js'

/** Made in the UAE: the factory, its address and a map link, with the spinning badge. */
export default function Factory() {
  return (
    <section className="factory" id="made-in-the-uae" aria-labelledby="factory-title">
      <div className="wrap factory__grid">
        <div className="factory__copy rv">
          <p className="label">
            <span className="label__num">05</span>The factory
          </p>
          <h2 className="factory__title display" id="factory-title">
            Made in the UAE
          </h2>
          <p className="factory__text">Every Ajeebas product is made in the UAE, at our factory in Al Qusais Industrial Area 4. Making it here means we stay close to our ingredients, our quality and our customers.</p>
          <address className="factory__addr">
            <span className="label">Address</span>
            <span>Ajeebas Chocolate Factory LLC</span>
            <span>Al Qusais Industrial Area 4, Dubai, UAE</span>
          </address>
          <a className="link-u" href="https://share.google/eYwytnkdoUx5muc4D" target="_blank" rel="noopener noreferrer">
            Open in Google Maps<span className="sr-only"> (opens in a new tab)</span>
            <svg aria-hidden="true">
              <use href="#i-arrow" />
            </svg>
          </a>
        </div>
        <div className="badge" aria-hidden="true">
          <svg viewBox="0 0 200 200" className="badge__ring">
            <defs>
              <path id="badge-path" d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0" />
            </defs>
            <text fontSize="15.5" letterSpacing="2.4" fontWeight="700" fontFamily="Archivo Variable, sans-serif" fill="currentColor">
              <textPath href="#badge-path" textLength="486" lengthAdjust="spacing">MADE IN UAE ✦ AL QUSAIS INDUSTRIAL AREA 4 ✦</textPath>
            </text>
          </svg>
          <svg className="badge__emblem" viewBox={VB.emblem.join(' ')} fill="currentColor" dangerouslySetInnerHTML={{ __html: parts.emblem }} />
        </div>
      </div>
    </section>
  )
}
