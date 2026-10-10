import { useCountdown } from '../lib/countdown.js'
import { parts, VB } from '../lib/logo.js'

function Odometer({ value, digits }) {
  const str = String(value).padStart(digits, '0')
  return (
    <span className="cd__num">
      {[...str].map((ch, i) => (
        <span className="cd__digit" key={`${str.length}-${i}`}>
          <span className="cd__col" style={{ transform: `translateY(${-ch * 10}%)` }}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  )
}

/** Made in the UAE, with a live countdown to the opening that turns into "Now open" on the day. */
export default function Factory() {
  const cd = useCountdown()
  const units = [
    ['Days', cd.d, cd.d > 99 ? 3 : 2],
    ['Hours', cd.h, 2],
    ['Minutes', cd.m, 2],
    ['Seconds', cd.s, 2],
  ]
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
          <p className="factory__text">Every Ajeebas product is made in Dubai, at our factory in Al Qusais Industrial Area 4. Making it here means we stay close to our ingredients, our quality and our customers.</p>
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
        <div className="countdown rv">
          <p className="countdown__label label">{cd.open ? 'Our doors are open' : 'Doors open in'}</p>
          <p className="sr-only">{cd.open ? 'Our factory opened on 23 October 2026.' : 'Our factory opens on 23 October 2026.'}</p>
          {cd.open ? (
            <p className="countdown__open display">Now open</p>
          ) : (
            <div className="countdown__units" aria-hidden="true">
              {units.map(([label, val, digits]) => (
                <div className="cd" key={label}>
                  <Odometer value={val} digits={digits} />
                  <span className="cd__u label">{label}</span>
                </div>
              ))}
            </div>
          )}
          <p className="countdown__date" aria-hidden="true">
            <span className="display">23.10</span>
            <span className="serif-i">2026</span>
          </p>
        </div>
        <div className="badge" aria-hidden="true">
          <svg viewBox="0 0 200 200" className="badge__ring">
            <defs>
              <path id="badge-path" d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0" />
            </defs>
            <text fontSize="15.5" letterSpacing="3.6" fontWeight="700" fontFamily="Archivo Variable, sans-serif" fill="currentColor">
              <textPath href="#badge-path">MADE IN DUBAI ✦ AL QUSAIS INDUSTRIAL AREA 4 ✦</textPath>
            </text>
          </svg>
          <svg className="badge__emblem" viewBox={VB.emblem.join(' ')} fill="currentColor" dangerouslySetInnerHTML={{ __html: parts.emblem }} />
        </div>
      </div>
    </section>
  )
}
