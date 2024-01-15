import { html } from 'htm/preact'
import { Display } from './display.mjs'
import { Markers } from './markers.mjs'
import { Hands } from './hands.mjs'
import { useDecimalTime } from '../hooks/use-decimal-time.mjs'
import s from './app.module.css'

export function App() {
  const { dHours, dMinutes, dSeconds } = useDecimalTime()
  return html`<main class=${s.display}>
    <div class=${s.paris}>Paris</div>
    <div class=${s.analogClock}>
      <${Markers} />
      <${Hands} dHours=${dHours} dMinutes=${dMinutes} dSeconds=${dSeconds} />
    </div>
    <${Display} dHours=${dHours} dMinutes=${dMinutes} dSeconds=${dSeconds} />
  </main>`
}
