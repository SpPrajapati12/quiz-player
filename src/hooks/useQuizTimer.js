import { useEffect, useRef, useState } from 'react'

/**
 * Runs a countdown from `duration` seconds, restarting whenever
 * `resetKey` changes. Calls `onExpire` once when it hits zero.
 * Paused when `paused` is true (e.g. after an option is selected).
 */
export function useQuizTimer(duration, resetKey, onExpire, paused = false) {
  const [secondsLeft, setSecondsLeft] = useState(duration)
  const onExpireRef = useRef(onExpire)
  const timeoutRef = useRef(null)
  const expiredRef = useRef(false)
  const justResetRef = useRef(false)

  onExpireRef.current = onExpire

  useEffect(() => {
    setSecondsLeft(duration)
    expiredRef.current = false
    justResetRef.current = true
  }, [resetKey, duration])

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    if (paused) {
      return undefined
    }

    if (secondsLeft <= 0) {
      if (justResetRef.current) {
        return undefined
      }
      if (!expiredRef.current) {
        expiredRef.current = true
        onExpireRef.current?.()
      }
      return undefined
    }

    justResetRef.current = false
    timeoutRef.current = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [secondsLeft, paused])

  return secondsLeft
}
