import { useEffect, useState } from 'react'

// 23 October 2026, 00:00 Dubai time (UTC+4)
export const OPENING = Date.parse('2026-10-23T00:00:00+04:00')

function parts(now) {
  const diff = OPENING - now
  if (diff <= 0) return { open: true, d: 0, h: 0, m: 0, s: 0 }
  return {
    open: false,
    d: Math.floor(diff / 86400000),
    h: Math.floor(diff / 3600000) % 24,
    m: Math.floor(diff / 60000) % 60,
    s: Math.floor(diff / 1000) % 60,
  }
}

/** live countdown; flips to the "open" state once the date passes */
export function useCountdown() {
  const [state, setState] = useState(() => parts(Date.now()))
  useEffect(() => {
    if (state.open) return
    const id = setInterval(() => {
      const next = parts(Date.now())
      setState(next)
      if (next.open) clearInterval(id)
    }, 1000)
    return () => clearInterval(id)
  }, [state.open])
  return state
}
