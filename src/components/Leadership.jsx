import { archD } from '../lib/arch.js'

/**
 * Leadership: the name set large in Fraunces italic, the client's text verbatim.
 * The portrait sits in the Ajeebas arch, ringed by a gold line that draws in on reveal.
 * Frame geometry is in a 440×H box; the photo's inset in CSS (.lead__photo) matches PHOTO and H.
 */
const H = 560
const PHOTO = { x: 23, y: 31, w: 394 }

export default function Leadership() {
  return (
    <section className="lead wrap" id="leadership" aria-labelledby="lead-title">
      <div className="lead__aside rv">
        <p className="label">
          <span className="label__num">06</span>Who leads Ajeebas
        </p>
        <h2 className="lead__title display" id="lead-title">
          Leadership
        </h2>
        <figure className="lead__portrait">
          <div className="lead__photo">
            <img
              src="/Leadership.jpeg"
              alt="Jamal Abdul Nazar, Chairman and Chief Executive Officer of Ajeebas Chocolate"
              width="3240"
              height="2160"
              loading="lazy"
              decoding="async"
            />
          </div>
          <svg className="lead__frame" viewBox={`0 0 440 ${H}`} aria-hidden="true" focusable="false">
            <path d={archD(1, 1, 438, H - 1)} pathLength="1" strokeWidth="1.2" strokeOpacity="0.6" />
            <path d={archD(PHOTO.x - 8, PHOTO.y - 11, PHOTO.w + 16, H - PHOTO.y + 11, false)} pathLength="1" strokeWidth="0.8" strokeOpacity="0.35" />
          </svg>
        </figure>
      </div>
      <div className="lead__body rv">
        <p className="lead__name serif-i">Jamal Abdul Nazar</p>
        <p className="lead__role label">Chairman &amp; Chief Executive Officer</p>
        <p className="lead__text">Ajeebas Chocolate is led by Jamal Abdul Nazar, a visionary entrepreneur with extensive experience in the UAE’s food distribution industry.</p>
        <p className="lead__more">Driven by a passion for quality, innovation, and customer satisfaction, he brings a wealth of market knowledge to Ajeebas. His vision is to create exceptional chocolate experiences while building lasting relationships with retailers and consumers. Beyond business, his vision is rooted in compassion and social responsibility. He believes that true success lies not only in business growth but also in giving back to society.</p>
        <p className="lead__vision serif-i">At Ajeebas, his vision is simple: to combine quality, trust, and innovation in every chocolate we create.</p>
      </div>
    </section>
  )
}
