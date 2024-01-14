import { differenceInMilliseconds, startOfDay } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

import './index.css'

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

    let fudge = 0
    if (i === 5) {
      fudge = 4
    } else if (i !== 10) {
      fudge = 3
    }
    const angle = (i / 10) * 360 + 45 + fudge

    nextTick.style.transform = `rotate(${angle}deg)`
    nextTick.querySelector('div').style.transform = `rotate(-${angle}deg)`
  }

  for (let i = 1; i <= 100; i++) {
    const nextTick = document.createElement('div')
    nextTick.innerHTML = `<div></div>`
    nextTick.className = `tick-100 n-${i}`

    nextTick.style.transform = `rotate(${(i / 100) * 360 + 45}deg)`
    if (i % 10 === 0) {
      nextTick.classList.add('major')
    }

    ticks.appendChild(nextTick)
  }
}

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
    dSeconds,
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
    hoursRotation: rotation(dHours, 10),
    minutesRotation: rotation(dMinutes, 100),
    secondsRotation: rotation(dSeconds, 100),
  }
}

const domContentLoaded = new Promise((resolve) =>
  document.addEventListener('DOMContentLoaded', resolve)
)

async function* timeStream() {
  while (true) {
    await new Promise((resolve) => setTimeout(resolve))

    const time = utcToZonedTime(new Date(), timeZone)

    yield conversion(time)
  }
}

const hands = (async () => {
  await domContentLoaded
  const hourHand = document.querySelector('.hands .hour')
  const minuteHand = document.querySelector('.hands .minute')
  const secondHand = document.querySelector('.hands .second')

  return { hourHand, minuteHand, secondHand }
})()

async function moveHands({ dHours, dMinutes, dSeconds }) {
  const { hourHand, minuteHand, secondHand } = await hands
  const { hoursRotation, minutesRotation, secondsRotation } = rotations({
    dHours,
    dMinutes,
    dSeconds,
  })

  hourHand.style.transform = hoursRotation
  minuteHand.style.transform = minutesRotation
  secondHand.style.transform = secondsRotation
}

const timeDisplay = (async () => {
  await domContentLoaded
  return document.querySelector('.decimal-time')
})()

async function writeDisplay({ dHours, dMinutes, dSeconds }) {
  const next = [padTime(dHours), padTime(dMinutes), padTime(dSeconds)].join(',')
  const display = await timeDisplay

  if (next === display.innerText) {
    return
  }

  display.innerText = next
}

async function renderTime() {
  for await (const next of timeStream()) {
    moveHands(next)
    writeDisplay(next)
  }
}

renderTime()
await domContentLoaded
renderMarkers()
