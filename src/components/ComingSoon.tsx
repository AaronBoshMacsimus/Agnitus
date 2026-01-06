import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function ComingSoon({ title }: { title: string }) {
  const container = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const subtextRef = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline()

      tl.from(textRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      })
        .from(
          lineRef.current,
          {
            width: 0,
            duration: 0.8,
            ease: 'power3.inOut',
          },
          '-=0.5'
        )
        .from(
          subtextRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=0.4'
        )

      // Continuous glitch/pulse effect
      gsap.to(textRef.current, {
        textShadow: '0 0 10px rgba(0, 255, 255, 0.5)', // Keeping rgba for opacity control, matches primary
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: 'sine.inOut',
      })
    },
    { scope: container }
  )

  return (
    <div
      ref={container}
      className="flex min-h-screen w-full flex-col items-center justify-center px-4 pt-20 pb-10 text-white md:pt-30 md:pr-16 md:pb-10 md:pl-36"
    >
      <div className="relative flex flex-col items-center gap-6">
        {/* Main Title */}
        <h1
          ref={textRef}
          className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
          style={{ fontFamily: 'var(--font-valorant)' }}
        >
          {title}
        </h1>

        {/* Decorator Line */}
        <div
          ref={lineRef}
          className="bg-primary h-1 w-32 shadow-[0_0_15px_var(--color-primary)]"
        />

        {/* Coming Soon Text */}
        <p
          ref={subtextRef}
          className="text-center text-base tracking-[0.3em] text-white/60 sm:text-lg sm:tracking-[0.5em] md:text-xl md:tracking-[0.6em] lg:text-2xl"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          COMING SOON
        </p>
      </div>

      {/* Background Decorator Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-secondary absolute top-1/4 left-1/4 h-2 w-2 rounded-full opacity-50 blur-[2px]" />
        <div className="bg-primary absolute right-1/4 bottom-1/3 h-2 w-2 rounded-full opacity-50 blur-[2px]" />
      </div>
    </div>
  )
}
