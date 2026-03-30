import { useState, useEffect, useCallback } from 'react'
import { useInView } from './useInView'

export function useCountUp(target, duration = 1200) {
  const { ref, inView } = useInView()
  const [count, setCount] = useState(0)
  const numericTarget = parseFloat(String(target).replace(/[^0-9.]/g, ''))
  const suffix = String(target).replace(/[0-9.]/g, '')

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    let rafId

    const tick = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * numericTarget))

      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        setCount(numericTarget)
      }
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [inView, numericTarget, duration])

  return { count, suffix, ref }
}
