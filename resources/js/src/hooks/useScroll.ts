import { useEffect, useState } from 'react'

/* ---------------------------------------------------------------------------
   useScroll — scroll-state utilities for the sticky header.
--------------------------------------------------------------------------- */

/** True once the page has scrolled past the given threshold (default 8px). */
export function useScrolled(threshold = 8): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return scrolled
}

/** Tracks scroll direction: true when scrolling down, false when up. */
export function useScrollDirection(): 'up' | 'down' {
  const [direction, setDirection] = useState<'up' | 'down'>('down')

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setDirection(y > lastY && y > 0 ? 'down' : 'up')
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return direction
}
