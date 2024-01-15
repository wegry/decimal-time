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

const timeZone = Temporal.TimeZone.from('Europe/Paris')

export function useDecimalTime() {
  const [decimalTime, setDecimalTime] = useState(() => {
    const dateTime = Temporal.Now.zonedDateTimeISO(timeZone)
    const delta = conversion(dateTime)
    return delta
  })

  useEffect(() => {
    async function* timeStream() {
      while (true) {
        await new Promise((resolve) => setTimeout(resolve))
        const dateTime = Temporal.Now.zonedDateTimeISO(timeZone)
        const delta = conversion(dateTime)
        yield delta
      }
    }

    const stream = timeStream()

    ;(async () => {
      for await (const delta of stream) {
        setDecimalTime(delta)
      }
    })()

    return () => {
      stream.return()
    }
  }, [])

  return decimalTime
}
