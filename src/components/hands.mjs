import { html } from 'htm/preact'
import { useRotations } from '../hooks/use-rotations.mjs'
import s from './hands.module.css'

export function Hand({ unit, rotation }) {
  return html`<div
    class="${s[unit]}"
    style="transform: rotate(${rotation})"
  ></div>`
}

export function Hands(props) {
  const { hoursRotation, minutesRotation, secondsRotation } =
    useRotations(props)
  return html`<div class=${s.hands}>
    <${Hand} rotation=${hoursRotation} unit="hour" />
    <${Hand} rotation=${minutesRotation} unit="minute" />
    <${Hand} rotation=${secondsRotation} unit="second" />
  </div>`
}
