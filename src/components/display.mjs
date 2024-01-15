import { html } from 'htm/preact'
import s from './display.module.css'

function padTime(time) {
  if (time < 1e-10 && time > -1e-10) {
    return '00'
  }
  return String(Math.floor(time)).padStart(2, '0')
}

function TimeCell({ time }) {
  return html`<span>${padTime(time)}</div>`
}

export function Display({ dHours, dMinutes, dSeconds }) {
  const next = [padTime(dHours), padTime(dMinutes), padTime(dSeconds)].map(
    (s) => html`<div>${s}</div>`
  )

  return html`<div class=${s.main}>
    <${TimeCell} time=${dHours} />
    <div>:</div>
    <${TimeCell} time=${dMinutes} />
    <div>:</div>
    <${TimeCell} time=${dSeconds} />
  </div>`
}
