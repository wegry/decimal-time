import { DateTime, Settings } from 'luxon'
import './index.scss'
import * as _ from 'lodash-es'

const STANDARD_SECONDS_PER_MINUTE = 60
const STANDARD_SECONDS_PER_HOUR = 60 * STANDARD_SECONDS_PER_MINUTE
const STANDARD_SECONDS_PER_DAY = 86400
const DECIMAL_SECONDS_PER_DAY = 100000

function renderMarkers() {
  const ticks = document.querySelector('.ticks')

  for (let i = 1; i <= 10; i++) {
    const nextTick = document.createElement('div')
    nextTick.innerHTML = `<div>${i}</div>`
    nextTick.className = `tick-10 n-${i}`
    ticks.appendChild(nextTick)
  }

  for (let i = 1; i <= 100; i++) {
    const nextTick = document.createElement('div')
    nextTick.innerHTML = `<div></div>`
    nextTick.className = `tick-100 n-${i}`
    ticks.appendChild(nextTick)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderMarkers()
  updateTime()
})

function padTime(time) {
  if (time < 1e-10 && time > -1e-10) {
    return '00'
  }
  return String(Math.floor(time)).padStart(2, '0')
}

function conversion(time) {
  const { second, minute, hour, millisecond } = time
  // Can't use Date.prototype.getTime here because of UTC v. CEST
  const decimalized =
    (second +
      STANDARD_SECONDS_PER_MINUTE * minute +
      STANDARD_SECONDS_PER_HOUR * hour) /
    STANDARD_SECONDS_PER_DAY
  const dHours = decimalized * 10
  const dMinutes = (decimalized * 1000) % 100
  const dSeconds =
    (decimalized * DECIMAL_SECONDS_PER_DAY + millisecond / 1000) % 100

  return {
    dHours,
    dMinutes,
    dSeconds
  }
}

Settings.defaultZoneName = 'Europe/Paris'

function rotation(amount, outOf, options) {
  const { log = false, smoothing = false } = options || {}
  const smoothed = smoothing ? Math.floor(amount) : amount,
    rotation = (smoothed / outOf) * 360

  if (log) {
    console.log(rotation)
  }
  return `rotate(${rotation}deg)`
}

function rotations({ dHours, dMinutes, dSeconds }) {
  return {
    hoursRotation: rotation(dHours, 10),
    minutesRotation: rotation(dMinutes, 100),
    secondsRotation: rotation(dSeconds, 100, { smoothing: true })
  }
}

const handSelectors = _.once(() => {
  const hourHand = document.querySelector('.hands .hour')
  const minuteHand = document.querySelector('.hands .minute')
  const secondHand = document.querySelector('.hands .second')

  return { hourHand, minuteHand, secondHand }
})

const timeDisplay = _.once(() => {
  return document.querySelector('.decimal-time')
})

// https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
function updateTime() {
  const time = DateTime.local()
  const { dHours, dMinutes, dSeconds } = conversion(time)
  const { hoursRotation, minutesRotation, secondsRotation } = rotations({
    dHours,
    dMinutes,
    dSeconds
  })

  // DOM Reads
  const { hourHand, minuteHand, secondHand } = handSelectors()
  const display = timeDisplay()

  // DOM Writes

  hourHand.style.transform = hoursRotation
  minuteHand.style.transform = minutesRotation
  secondHand.style.transform = secondsRotation
  display.innerHTML = `${padTime(dHours)}:${padTime(dMinutes)}:${padTime(
    dSeconds
  )}`

  requestAnimationFrame(updateTime)
}
