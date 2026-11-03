// Time-limited promotions. Everything here switches itself off at its end date (Dubai time), so nothing
// has to be removed by hand; delete an entry (and its markup) once it has ended for good.

// ISM Middle East 2026: the top strip and the hero card ("taste them at ISM")
export const ISM = {
  until: Date.parse('2026-11-06T00:00:00+04:00'), // after the last day, 5 Nov
  name: 'ISM Middle East',
  hall: "Za'abeel Hall 4",
  stand: 'Z4-25',
  dates: '3–5 Nov',
  venue: 'DWTC',
}

// "New" tags on the Rooh Afza Kunafa Bar tab and the Healthy collection
export const NEW_UNTIL = Date.parse('2026-12-01T00:00:00+04:00')

export const isOn = (until) => Date.now() < until

/** jump to a product panel and show one of its flavours (used by the promo links) */
export function showProduct(line, key) {
  window.dispatchEvent(new CustomEvent('ajeebas:select', { detail: { line, key } }))
}
