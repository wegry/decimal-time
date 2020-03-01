import { DateTime, Settings } from 'luxon'
import './index.scss'

const STANDARD_SECONDS_PER_MINUTE = 60
const STANDARD_SECONDS_PER_HOUR = 60 * STANDARD_SECONDS_PER_MINUTE
const STANDARD_SECONDS_PER_DAY = 86400
const DECIMAL_SECONDS_PER_DAY = 100000

document.addEventListener('DOMContentLoaded', () => {
  updateTime()
  setInterval(updateTime, 16)
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

function rotation(amount, outOf, log = false) {
  const rotation = (amount / outOf) * 360
  if (log) {
    console.log(rotation)
  }
  return `rotate(${rotation}deg)`
}

function handPlacement({ dHours, dMinutes, dSeconds }) {
  const hourHand = document.querySelector('.hands .hour')
  const minuteHand = document.querySelector('.hands .minute')
  const secondHand = document.querySelector('.hands .second')

  hourHand.style.transform = rotation(dHours, 10)
  minuteHand.style.transform = rotation(dMinutes, 100)
  secondHand.style.transform = rotation(dSeconds, 100)
}

function updateTime() {
  const time = DateTime.local()
  const { dHours, dMinutes, dSeconds } = conversion(time)

  handPlacement({ dHours, dMinutes, dSeconds })

  document.querySelector('.decimal-time').innerHTML = `${padTime(
    dHours
  )}:${padTime(dMinutes)}:${padTime(dSeconds)}`
}
