import { useEffect, useState, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { getDaysRemaining } from '../utils/dateUtils'
import Lenis from 'lenis'
import StarryBackground from '../components/StarryBackground'
import HyperText from '../components/HyperText'
import gsap from 'gsap'

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [revealed, setRevealed] = useState(false) // Controls background fade-in
  const daysRemaining = getDaysRemaining('2026-02-27')

  // ... refs ...
  const mobileProgressRef = useRef<HTMLDivElement>(null)
  const desktopProgressRef = useRef<HTMLDivElement>(null)
  const mobileHeaderRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLDivElement>(null)
  const statsContainerRef = useRef<HTMLDivElement>(null)

  // Use the hook to animate both progress bars
  useScrollProgress([mobileProgressRef, desktopProgressRef])

  useEffect(() => {
    // ... GSAP and Lenis logic remains same ...
    const lenis = new Lenis()
    function raf(time: number) { lenis.raf(time * 1000) }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    const ctx = gsap.context(() => {
      // ... existing setup ...
      // Mobile Header: Slide down
      gsap.from(mobileHeaderRef.current, { y: -50, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2 })
      // Desktop Menu Button: Fade in
      gsap.from(menuButtonRef.current, { x: -20, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.4 })
      // Desktop Stats: Staggered slide down
      if (statsContainerRef.current) {
        const statsItems = statsContainerRef.current.children
        gsap.from(statsItems, { y: -20, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.6 })
      }
    })

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      ctx.revert()
    }
  }, [])

  return (
    // changed bg-background to bg-transparent to see through to Loading
    <div className="bg-transparent relative min-h-dvh w-full transition-colors duration-1000">

      {/* Background and Nav Wrapper - Fades in upon Reveal */}
      <div
        style={{
          opacity: revealed ? 1 : 0,
          transition: 'opacity 2s ease-in-out'
        }}
        className="pointer-events-none fixed inset-0 z-0"
      >
        <div className="absolute inset-0 bg-background" /> {/* Solid backdrop for stars */}
        <StarryBackground />

        {/* We move Navbar/Overlay INSIDE here so they fade in too? 
            Or keep them visible? User said "initial bg... loading bg". 
            Usually Navbar should fade in with the content. Let's wrap them.
         */}
      </div>

      {/* Mobile Header (Now controlled by reveal opacity via parent or style?) 
          Actually, let's just make the components themselves depend on 'revealed' or just wrap them.
          Wrapping them in a fixed div might mess up layout if they rely on flow.
          Let's control opacity directly on them.
      */}

      {/* Mobile Header */}
      <div
        ref={mobileHeaderRef}
        className="border-border-custom bg-background fixed top-6 left-1/2 z-50 flex h-14 w-[90%] -translate-x-1/2 items-center justify-between overflow-hidden rounded-[5px] border px-4 md:hidden"
        style={{ opacity: revealed ? 1 : 0, transition: 'opacity 1s' }} // Added opacity control
      >
        {/* ... content ... */}
        <div ref={mobileProgressRef} className="absolute top-0 bottom-0 left-0 z-0 w-0 bg-white/10" />
        <HyperText
          text="AGNITUS"
          className="relative z-10 pt-1 text-xl leading-none font-normal text-white"
          style={{ fontFamily: 'var(--font-valorant)' }}
          delay={1.2}
        />
        <div className="group relative z-10 flex cursor-pointer flex-col items-end gap-1.5" onClick={() => setIsSidebarOpen(true)}>
          <div className="group-hover:bg-primary h-0.5 w-6 rounded-full bg-white transition-all duration-300" />
          <div className="group-hover:bg-primary h-0.5 w-4 rounded-full bg-white transition-all duration-300 group-hover:w-6" />
        </div>
      </div>

      {/* Desktop Grid Layout Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-30 hidden px-8 py-6 md:block md:px-16 md:py-10"
        style={{ opacity: revealed ? 1 : 0, transition: 'opacity 1s' }} // Added opacity control
      >
        <div className="border-border-custom relative flex h-full w-full flex-col rounded-[10px] border">
          {/* ... Header Row ... */}
          <div className="border-border-custom relative flex h-20 w-full border-b">
            <div ref={desktopProgressRef} className="absolute top-0 bottom-0 left-0 z-0 w-0 bg-white/10" />

            <div
              ref={menuButtonRef}
              className="group border-border-custom pointer-events-auto relative z-10 flex aspect-square h-full w-20 cursor-pointer items-center justify-center border-r transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <div className="flex flex-col items-start gap-2">
                <div className="group-hover:bg-primary h-1 w-6 rounded-full bg-white transition-all duration-300 group-hover:w-10" />
                <div className="group-hover:bg-primary h-1 w-10 rounded-full bg-white transition-all duration-300" />
              </div>
            </div>

            {/* Stats Header */}
            <div className="relative z-10 flex flex-1 items-center justify-end px-6 sm:px-10">
              <div ref={statsContainerRef} className="flex items-center gap-4 text-xs leading-none font-medium tracking-wide text-white sm:gap-8 sm:text-sm">
                <div className="flex items-center gap-2"><img src="/i1.svg" alt="Events" className="h-4 w-auto" /><span>0/10 Events</span></div>
                <div className="flex items-center gap-2"><img src="/i3.svg" alt="Days" className="h-4 w-auto" /><span>{daysRemaining} Days</span></div>
                <div className="flex items-center gap-2"><img src="/i4.svg" alt="Partners" className="h-4 w-auto" /><span>50 Partners</span></div>
                <div className="flex items-center gap-2"><img src="/i5.svg" alt="Participants" className="h-4 w-auto" /><span>2000+ participants</span></div>
              </div>
            </div>
          </div>
          {/* ... Body ... */}
          <div className="flex w-full flex-1">
            <div className="border-border-custom w-20 border-r" />
            <div className="relative flex-1"></div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <Outlet context={{ setRevealed }} />

      {/* Global Sidebar (Modal) */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  )
}
