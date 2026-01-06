import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const useScrollProgress = (
  refs: React.RefObject<HTMLElement | null>[]
) => {
  const location = useLocation()

  useGSAP(
    () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight

      // Only set up animation if there is content to scroll
      if (totalHeight >= 0) {
        refs.forEach((ref) => {
          if (ref.current) {
            // Kill old animations to prevent conflict on refresh
            gsap.killTweensOf(ref.current)

            gsap.fromTo(
              ref.current,
              { width: '0%' },
              {
                width: '100%',
                ease: 'none',
                scrollTrigger: {
                  trigger: document.documentElement,
                  start: 'top top',
                  end: 'bottom bottom',
                  scrub: 0.2, // Slight smoothing
                },
              }
            )
          }
        })
      }
    },
    { dependencies: [refs] } // Re-run if refs array changes (unlikely)
  )

  // Refresh ScrollTrigger when route changes to recalculate page height
  useEffect(() => {
    // Small delay to ensure DOM has updated
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)
    return () => clearTimeout(timer)
  }, [location.pathname])
}
