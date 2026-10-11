import { useRef, useState } from 'react'
import { archD } from '../lib/arch.js'

const TYPES = ['Supermarket', 'Distributor', 'Gifting & hospitality', 'Other']
const RULES = {
  name: (v) => (v.trim().length < 2 ? 'Please tell us your name.' : ''),
  company: (v) => (v.trim().length < 2 ? 'Please add your company name.' : ''),
  email: (v) => (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? 'Please enter a valid email address.' : ''),
  message: (v) => (v.trim().length < 10 ? 'A line or two about what you are looking for helps us reply.' : ''),
}
const MAIL = 'info@ajeebaschocolate.com'
// Web3Forms access key (set VITE_WEB3FORMS_ACCESS_KEY in .env). Submissions go to the inbox the key belongs to.
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
const WEB3FORMS_URL = 'https://api.web3forms.com/submit'

/**
 * Work with us. The form validates, then sends the enquiry through Web3Forms. Without an access key
 * (or if sending fails) it falls back to opening the visitor's email app, addressed to
 * info@ajeebaschocolate.com. The address is also a plain link.
 * Background: espresso with the emblem's gold lattice glowing through a tall arch.
 */
export default function Partner() {
  const formRef = useRef(null)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)

  const check = (name, value) => {
    const msg = name === 'type' ? (value ? '' : 'Please choose what kind of partner you are.') : RULES[name](value)
    setErrors((e) => ({ ...e, [name]: msg }))
    return msg
  }

  const onBlur = (e) => {
    const { name, value } = e.target
    if (RULES[name] && value) check(name, value)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (sending) return
    const f = formRef.current
    const val = (k) => f.elements[k].value
    const type = f.querySelector('input[name="type"]:checked')?.value || ''
    const next = {}
    let first = null
    for (const k of Object.keys(RULES)) {
      next[k] = RULES[k](val(k))
      if (next[k] && !first) first = f.elements[k]
    }
    next.type = type ? '' : 'Please choose what kind of partner you are.'
    if (next.type && !first) first = f.querySelector('input[name="type"]')
    setErrors(next)
    if (Object.values(next).some(Boolean)) {
      setStatus('Please check the highlighted fields.')
      first?.focus()
      return
    }
    const v = (k) => val(k).trim()
    const subject = `Partnership enquiry: ${type} - ${v('company')}`
    const body = `Name: ${v('name')}\nCompany: ${v('company')}\nEmail: ${v('email')}\nPartner type: ${type}\n\n${v('message')}\n`
    const openMail = (lead) => {
      setStatus(`${lead}Opening your email app with your message to ${MAIL}…`)
      window.location.href = `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    }
    if (!WEB3FORMS_KEY) {
      openMail('')
      return
    }
    // a bot filled the hidden field: pretend it worked
    if (f.elements.botcheck.checked) {
      setStatus('Thank you. Your message has been sent.')
      return
    }
    const who = v('name')
    setSending(true)
    setStatus('Sending your message…')
    try {
      const res = await fetch(WEB3FORMS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject,
          from_name: `${v('name')} (${v('company')}) via ajeebaschocolate.com`,
          replyto: v('email'),
          name: v('name'),
          company: v('company'),
          email: v('email'),
          partner_type: type,
          message: v('message'),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success) throw new Error(data.message || `HTTP ${res.status}`)
      f.reset()
      setErrors({})
      setStatus(`Thank you, ${who}. Your message has been sent and we will reply to you soon.`)
    } catch {
      openMail('We could not send the form just now. ')
    } finally {
      setSending(false)
    }
  }

  const field = (name, label, props = {}) => (
    <div className={`field${errors[name] ? ' has-error' : ''}`}>
      <label htmlFor={`f-${name}`}>{label}</label>
      {props.textarea ? (
        <textarea id={`f-${name}`} name={name} rows="4" required aria-invalid={!!errors[name]} aria-describedby={`f-${name}-err`} onBlur={onBlur} />
      ) : (
        <input id={`f-${name}`} name={name} type={props.type || 'text'} autoComplete={props.auto} required aria-invalid={!!errors[name]} aria-describedby={`f-${name}-err`} onBlur={onBlur} />
      )}
      <p className="field__err" id={`f-${name}-err`} aria-live="polite">
        {errors[name]}
      </p>
    </div>
  )

  return (
    <section className="partner" id="work-with-us" aria-labelledby="partner-title" data-header="dark">
      <div className="partner__bg" aria-hidden="true">
        <svg className="partner__arch" viewBox="0 0 600 900" preserveAspectRatio="xMidYMin meet">
          <defs>
            <clipPath id="partnerArch">
              <path d={archD(40, 40, 520, 900)} />
            </clipPath>
            <radialGradient id="partnerGlow" cx="0.5" cy="0.42" r="0.6">
              <stop offset="0" stopColor="#4A2C1E" />
              <stop offset="1" stopColor="#1A100B" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="600" height="900" fill="url(#partnerGlow)" clipPath="url(#partnerArch)" />
          <path d={archD(40, 40, 520, 900, false)} fill="none" stroke="#BD9D28" strokeOpacity="0.55" strokeWidth="1.2" />
          <path d={archD(62, 70, 476, 900, false)} fill="none" stroke="#BD9D28" strokeOpacity="0.3" strokeWidth="0.8" />
        </svg>
        <span className="partner__lattice" />
      </div>
      <div className="wrap partner__grid">
        <div className="partner__copy rv">
          <p className="label label--fraunces">
            <span className="label__num">07</span>Partnerships
          </p>
          <h2 className="partner__title fr" id="partner-title">
            Work <br />
            with us
          </h2>
          <p className="partner__text">We are working with supermarkets, distributors, and gifting and hospitality partners. If you would like to stock Ajeebas or talk about a partnership, we would love to hear from you.</p>
          <ul className="partner__types" aria-label="Who we work with">
            <li>Supermarkets</li>
            <li>Distributors</li>
            <li>Gifting &amp; hospitality</li>
          </ul>
          <div className="partner__direct">
            <p className="label">Email us directly</p>
            <a className="partner__email" href={`mailto:${MAIL}`}>
              {MAIL}
            </a>
            <address className="partner__address">
              Ajeebas Chocolate Factory LLC
              <br />
              <a href="https://share.google/eYwytnkdoUx5muc4D" target="_blank" rel="noopener noreferrer">
                Al Qusais Industrial Area 4, Dubai, UAE<span className="sr-only"> (map, opens in a new tab)</span>
              </a>
            </address>
          </div>
        </div>

        <form className="form rv" ref={formRef} noValidate aria-labelledby="form-title" onSubmit={onSubmit}>
          <h3 className="form__title fr" id="form-title">
            Contact us
          </h3>
          <p className="form__hint">Tell us a little about your business and we will reply by email. You can also write to us at {MAIL}.</p>
          {/* honeypot for spam bots (Web3Forms) */}
          <input type="checkbox" name="botcheck" className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          {field('name', 'Your name', { auto: 'name' })}
          {field('company', 'Company', { auto: 'organization' })}
          {field('email', 'Work email', { type: 'email', auto: 'email' })}
          <fieldset className={`field field--chips${errors.type ? ' has-error' : ''}`}>
            <legend>I am a</legend>
            <div className="chips">
              {TYPES.map((t) => (
                <label className="chip" key={t}>
                  <input type="radio" name="type" value={t} required onChange={() => check('type', t)} aria-describedby="f-type-err" />
                  <span>{t}</span>
                </label>
              ))}
            </div>
            <p className="field__err" id="f-type-err" aria-live="polite">
              {errors.type}
            </p>
          </fieldset>
          {field('message', 'Message', { textarea: true })}
          <button className="btn btn--pist btn--block" type="submit" disabled={sending} aria-busy={sending}>
            <span>{sending ? 'Sending…' : 'Send to Ajeebas'}</span>
            <svg aria-hidden="true">
              <use href="#i-arrow" />
            </svg>
          </button>
          <p className="form__status" role="status" aria-live="polite">
            {status}
          </p>
        </form>
      </div>
    </section>
  )
}
