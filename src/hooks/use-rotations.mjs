import { useMemo } from 'preact/hooks'

function rotation(amount, outOf, options) {
  const { log = false, snap = true } = options || {}
  const smoothed = snap ? Math.floor(amount) : amount,
    rotation = (smoothed / outOf) * 360

  if (log) {
    console.log(rotation)
  }
  return `${rotation}deg`
}

export function useRotations({ dHours, dMinutes, dSeconds }) {
  return useMemo(() => ({
    hoursRotation: rotation(dHours, 10),
    minutesRotation: rotation(dMinutes, 100),
    secondsRotation: rotation(dSeconds, 100),
  }))
}
