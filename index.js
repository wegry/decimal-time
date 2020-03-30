import { differenceInMilliseconds, startOfDay } from 'date-fns'
import { toDate, utcToZonedTime } from 'date-fns-tz'

import './index.scss'
import * as _ from 'lodash-es'

const STANDARD_SECONDS_PER_MINUTE = 60
const STANDARD_SECONDS_PER_DAY = 86400
const DECIMAL_SECONDS_PER_DAY = 100000
const STANDARD_MILLISECONDS_PER_DAY = STANDARD_SECONDS_PER_DAY * 1000

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

const timeZone = 'Europe/Paris'

function conversion(time) {
  const dayStart = startOfDay(time)
  const decimalized = differenceInMilliseconds(time, dayStart)
  // console.log(time, dayStart)

  const dayPortionPassed = decimalized / STANDARD_MILLISECONDS_PER_DAY
  const dHours = dayPortionPassed * 10
  const dMinutes = (dayPortionPassed * 10 * 100) % 100
  const dSeconds = (dayPortionPassed * DECIMAL_SECONDS_PER_DAY) % 100

  return {
    dHours,
    dMinutes,
    dSeconds
  }
}

function rotation(amount, outOf, options) {
  const { log = false, snap = true } = options || {}
  const smoothed = snap ? Math.floor(amount) : amount,
    rotation = (smoothed / outOf) * 360

  if (log) {
    console.log(rotation)
  }
  return `rotate(${rotation}deg)`
}

function rotations({ dHours, dMinutes, dSeconds }) {
  return {
    hoursRotation: rotation(dHours, 10, { snap: false }),
    minutesRotation: rotation(dMinutes, 100, { snap: false }),
    secondsRotation: rotation(dSeconds, 100, { snap: true })
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
  const time = utcToZonedTime(new Date(), { timeZone })

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
