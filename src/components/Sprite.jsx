// Ingredient pictograms and small icons (palette colours only), referenced with <use href="#i-...">
const SYMBOLS = `<defs>
        <linearGradient id="g-almond" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B88553"/><stop offset=".55" stop-color="#8F6A4B"/><stop offset="1" stop-color="#7A4A2E"/></linearGradient>
        <linearGradient id="g-pist" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E8EFD6"/><stop offset=".35" stop-color="#A8C686"/><stop offset="1" stop-color="#4F7A3A"/></linearGradient>
        <linearGradient id="g-date" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7A4A2E"/><stop offset=".5" stop-color="#4A2C1E"/><stop offset="1" stop-color="#1A100B"/></linearGradient>
        <linearGradient id="g-shell" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FCF9F3"/><stop offset=".5" stop-color="#DCC9AE"/><stop offset="1" stop-color="#B88553"/></linearGradient>
        <linearGradient id="g-chunk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7A4A2E"/><stop offset="1" stop-color="#2B1A12"/></linearGradient>
      </defs>
      <symbol id="i-almond" viewBox="0 0 100 100"><path d="M50 6C70 22 80 48 74 70 69 86 59 94 50 94 41 94 31 86 26 70 20 48 30 22 50 6Z" fill="url(#g-almond)"/><path d="M50 12C46 34 44 62 47 88M40 24C35 44 34 66 38 84M60 24C64 44 66 66 62 84" fill="none" stroke="#7A4A2E" stroke-width="1.6" stroke-linecap="round" opacity=".55"/><path d="M42 20C36 32 33 46 33 58" fill="none" stroke="#DCC9AE" stroke-width="3.5" stroke-linecap="round" opacity=".55"/></symbol>
      <symbol id="i-pistachio" viewBox="0 0 100 100"><path d="M18 58C14 36 34 16 58 16 78 16 90 30 86 48 82 70 60 86 40 84 28 83 20 72 18 58Z" fill="url(#g-pist)"/><path d="M62 20C76 22 86 34 84 48 80 62 70 70 60 72 68 58 70 36 62 20Z" fill="#8F6A4B" opacity=".45"/><path d="M30 44C34 32 44 26 54 25" fill="none" stroke="#FCF9F3" stroke-width="4" stroke-linecap="round" opacity=".6"/></symbol>
      <symbol id="i-pistachio-shell" viewBox="0 0 100 100"><path d="M10 54C10 30 34 14 60 18 82 22 94 40 88 58 80 80 52 90 30 82 18 77 10 67 10 54Z" fill="url(#g-shell)"/><path d="M20 46C30 30 50 24 70 28 80 30 86 38 86 44 70 40 48 42 20 46Z" fill="url(#g-pist)"/><path d="M14 56C34 50 62 48 88 54" fill="none" stroke="#8F6A4B" stroke-width="2" opacity=".7"/><path d="M26 66C30 72 38 76 46 77" fill="none" stroke="#B88553" stroke-width="2" stroke-linecap="round" opacity=".7"/></symbol>
      <symbol id="i-date" viewBox="0 0 100 100"><path d="M50 4C68 6 78 26 78 50 78 76 66 96 50 96 34 96 22 76 22 50 22 26 32 4 50 4Z" fill="url(#g-date)"/><path d="M36 22C40 40 34 58 40 80M50 12C54 36 46 60 52 90M64 22C60 42 66 60 60 82" fill="none" stroke="#1A100B" stroke-width="2" stroke-linecap="round" opacity=".55"/><path d="M34 26C30 40 30 54 33 64" fill="none" stroke="#B88553" stroke-width="4" stroke-linecap="round" opacity=".55"/></symbol>
      <symbol id="i-chunk" viewBox="0 0 100 100"><path d="M12 40 44 14 88 30 82 72 46 88 16 70Z" fill="url(#g-chunk)"/><path d="M12 40 44 14 88 30 52 46Z" fill="#7A4A2E"/><path d="M52 46 88 30 82 72 46 88Z" fill="#2B1A12" opacity=".55"/><path d="M14 41 44 16 86 31" fill="none" stroke="#B88553" stroke-width="2.5" stroke-linejoin="round" opacity=".7"/></symbol>
      <symbol id="i-coconut" viewBox="0 0 100 100"><path d="M14 60C24 34 52 24 80 30 70 36 60 44 56 56 46 52 30 54 14 60Z" fill="#FCF9F3"/><path d="M14 60C30 54 46 52 56 56 52 64 50 72 52 80 38 70 26 64 14 60Z" fill="#DCC9AE"/><path d="M80 30C70 36 60 44 56 56 52 64 50 72 52 80" fill="none" stroke="#B88553" stroke-width="3" stroke-linecap="round"/></symbol>
      <symbol id="i-star" viewBox="0 0 100 100"><path d="M50 2 61.5 22.3 83.9 16.1 77.7 38.5 98 50 77.7 61.5 83.9 83.9 61.5 77.7 50 98 38.5 77.7 16.1 83.9 22.3 61.5 2 50 22.3 38.5 16.1 16.1 38.5 22.3Z"/></symbol>
      <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M4 12h15M13 5l7 7-7 7"/></symbol><symbol id="i-down" viewBox="0 0 20 20"><path d="M10 4v12m-5-5 5 5 5-5"/></symbol>
      <symbol id="i-leaf" viewBox="0 0 24 24"><path d="M5 19C5 10 11 5 20 4c0 9-5 15-14 15Zm0 0 9-9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></symbol>
      <symbol id="i-pod" viewBox="0 0 24 24"><path d="M12 3c4 2.5 5 6 5 9s-1 6.5-5 9c-4-2.5-5-6-5-9s1-6.5 5-9Zm0 0v18M9 7.5l3 2 3-2M9 12l3 2 3-2M9 16.5l3 2 3-2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></symbol>
      <symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></symbol>`

export default function Sprite() {
  return <svg className="sprite" aria-hidden="true" focusable="false" width="0" height="0" dangerouslySetInnerHTML={{ __html: SYMBOLS }} />
}

export function Icon({ id, className }) {
  return (
    <svg className={className} aria-hidden="true" focusable="false">
      <use href={`#i-${id}`} />
    </svg>
  )
}
