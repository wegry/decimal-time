import { html } from 'htm/preact'
import s from './markers.module.css'

export function Markers() {
  const numbers = Array.from({ length: 10 }).map((_, i) => {
    let fudge = 0
    if (i === 5) {
      fudge = 4
    } else if (i !== 10) {
      fudge = 3
    }

    const angle = (i / 10) * 360 + 45 + fudge
    return html`<div class="${s.tick10}" style="transform: rotate(${angle}deg)">
      <div style="transform: rotate(-${angle}deg">${i}</div>
    </div>`
  })

  const ticks = Array.from({ length: 100 }).map((_, i) => {
    return html`<div
      class="${s.tick100} ${i % 10 === 0 ? 'major' : ''}"
      style="transform: rotate(${(i / 100) * 360 + 45}deg);"
    >
      <div></div>
    </div>`
  })

  return html`<div class=${s.ticks}>${numbers}${ticks}</div>`
}
