import { DateTime, Zone } from 'luxon'

const STANDARD_SECONDS_PER_MINUTE = 60
const STANDARD_SECONDS_PER_HOUR = 60 * STANDARD_SECONDS_PER_MINUTE
const STANDARD_SECONDS_PER_DAY = 86400
const DECIMAL_SECONDS_PER_DAY = 100000

document.addEventListener('DOMContentLoaded', () => {
  updateTime()
  setInterval(
    updateTime,
    STANDARD_SECONDS_PER_DAY / DECIMAL_SECONDS_PER_DAY * 1000)
})

function padTime(time) {
  return String(time).padStart(2, '0')
}

function updateTime() {
  const parisianTime = DateTime.local().setZone('Europe/Paris')
  const {second, minute, hour} = parisianTime
  const timeThroughDay = (second + STANDARD_SECONDS_PER_MINUTE * minute + STANDARD_SECONDS_PER_HOUR * hour) / STANDARD_SECONDS_PER_DAY
  const decimalized = timeThroughDay
  const dHours = Math.floor(decimalized * 10)
  const dMinutes = Math.floor(10 * 100 * (decimalized - (dHours / 10)))
  const dSeconds = Math.floor((DECIMAL_SECONDS_PER_DAY * decimalized) % 100)
  document.querySelector('.decimal-time').innerHTML = `${padTime(dHours)}:${padTime(dMinutes)}:${padTime(dSeconds)}`
}