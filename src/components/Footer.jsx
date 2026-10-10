const LINKS = [
  ['our-story', 'Our story'],
  ['what-we-make', 'What we make'],
  ['line-dates', 'The range'],
  ['promises', 'Our four promises'],
  ['made-in-the-uae', 'Made in the UAE'],
  ['leadership', 'Leadership'],
  ['work-with-us', 'Work with us'],
]

export default function Footer() {
  return (
    <footer className="ftr" data-header="dark">
      <div className="wrap ftr__grid">
        <img className="ftr__logo" src="/logo/ajeebas-logo.svg" alt="Ajeebas Chocolate" width="487" height="421" loading="lazy" />
        <p className="ftr__line label">
          Richer <span aria-hidden="true">·</span> Naturally <span aria-hidden="true">·</span> Extraordinary
        </p>
        <nav className="ftr__nav" aria-label="Footer">
          <ul>
            {LINKS.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ftr__contact">
          <a href="mailto:info@ajeebaschocolate.com">info@ajeebaschocolate.com</a>
          <address>
            Ajeebas Chocolate Factory LLC
            <br />
            <a href="https://share.google/eYwytnkdoUx5muc4D" target="_blank" rel="noopener noreferrer">
              Al Qusais Industrial Area 4, Dubai, UAE<span className="sr-only"> (map, opens in a new tab)</span>
            </a>
          </address>
        </div>
        <p className="ftr__legal label">
          © 2026 Ajeebas Chocolate Factory LLC <span aria-hidden="true">·</span> Made in Dubai
        </p>
      </div>
    </footer>
  )
}
