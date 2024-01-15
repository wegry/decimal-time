import { useEffect, useState } from 'preact/hooks'
import { Temporal } from 'temporal-polyfill'
import * as constants from '../constants.mjs'

/**
 * @param {import('temporal-polyfill').Temporal.ZonedDateTime} time
 */
function conversion(time) {
  const dayStart = time.startOfDay()
  const decimalized = time.since(dayStart)

  const dayPortionPassed =
    decimalized.total('milliseconds') / constants.STANDARD_MILLISECONDS_PER_DAY
  const dHours = dayPortionPassed * 10
  const dMinutes = (dayPortionPassed * 10 * 100) % 100
  const dSeconds = (dayPortionPassed * constants.DECIMAL_SECONDS_PER_DAY) % 100

  return {
    dHours,
    dMinutes,
    dSeconds,
  }
}

/** https://gist.github.com/AlexJWayne/1d99b3cd81d610ac7351 */
function accurateInterval(time, fn) {
  const nextAt = new Date().getTime() + time
  let timeout = null

  function wrapper() {
    nextAt += time
    timeout = setTimeout(wrapper, nextAt - new Date().getTime())
    return fn()
  }
  function cancel() {
    return clearTimeout(timeout)
  }
  timeout = setTimeout(wrapper, nextAt - new Date().getTime())
  return {
    cancel: cancel,
  }
}

const timeZone = Temporal.TimeZone.from('Europe/Paris')

export function useDecimalTime() {
  const [decimalTime, setDecimalTime] = useState(() => {
    const dateTime = Temporal.Now.zonedDateTimeISO(timeZone)
    const delta = conversion(dateTime)
    return delta
  })

  useEffect(() => {
    const interval = accurateInterval(840, () => {
      const dateTime = Temporal.Now.zonedDateTimeISO(timeZone)
      const delta = conversion(dateTime)
      setDecimalTime(delta)
    })

    return () => {
      interval.cancel()
    }
  }, [])

  return decimalTime
}
