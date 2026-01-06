import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export default function AboutText() {
  const container = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline()

      tl.from(labelRef.current, {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
      }).from(
        textRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 1.2,
          delay: 0.1,
          ease: 'power2.out',
        },
        '-=0.6'
      )
    },
    { scope: container }
  )

  return (
    <section
      ref={container}
      className="relative flex w-full flex-col items-center justify-center bg-transparent px-6 py-2 pt-10 md:mt-20 md:px-0 md:py-10 md:pl-44"
    >
      <div className="flex w-fit flex-col items-start gap-4">
        {/* Label (Left alignment) */}
        <div
          ref={labelRef}
          className="flex shrink-0 items-center gap-3 md:w-auto"
        >
          <div className="bg-primary h-1.5 w-1.5 animate-pulse shadow-[0_0_8px_var(--color-primary)]" />
          <span
            className="text-label-sm sm:text-label-base leading-normal font-normal tracking-[0.0525rem] text-white uppercase opacity-80"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            About Agnitus
          </span>
        </div>

        {/* Main Text Content (Right alignment) */}
        <div className="flex-1">
          <p
            ref={textRef}
            className="xl:text-heading-lg text-left text-sm font-bold text-white uppercase sm:text-base md:max-w-xl md:text-xl lg:max-w-3xl lg:text-2xl xl:max-w-4xl xl:leading-[1.04705] xl:tracking-[0.07rem]"
            style={{
              fontFamily: 'var(--font-unison)',
              fontWeight: 700,
            }}
          >
            LOREM IPSUM ET UT VOLUTPAT ERAT FAUCIBUS MAURIS VIVERRA AUCTOR RISUS
            IACULIS ULTRICES QUAM GRAVIDA AUCTOR RISUS IACULIS ULTRICES QUAM
            GRAVIDA AUCTOR RISUS IACULIS ULTRICES QUAM GRAVIDA AUCTOR RISUS
            IACULIS ULTRICES QUAM GRAVIDA.
          </p>
        </div>
      </div>
    </section>
  )
}
