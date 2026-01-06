import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'

interface HyperTextProps {
  text: string
  className?: string
  style?: React.CSSProperties
  duration?: number
  delay?: number
}

export default function HyperText({
  text,
  className,
  style,
  duration = 1,
  delay = 0,
}: HyperTextProps) {
  const [displayText, setDisplayText] = useState(text.split('').map(() => ' '))
  const animationRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const chars = text.split('')
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay })

      chars.forEach((char, i) => {
        tl.to(
          {},
          {
            duration: duration / chars.length,
            onUpdate: () => {
              setDisplayText((prev) => {
                const newText = [...prev]
                // Random character cycling before settling
                newText[i] =
                  Math.random() > 0.5
                    ? CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
                    : char
                return newText
              })
            },
            onComplete: () => {
              setDisplayText((prev) => {
                const newText = [...prev]
                newText[i] = char
                return newText
              })
            },
          },
          // Stagger slightly or run sequentially?
          // Let's overlap them slightly for a "wave" of decryption
          i * (duration / chars.length) * 0.5
        )
      })

      animationRef.current = tl
    })

    return () => ctx.revert()
  }, [text, duration, delay])

  return (
    <span className={className} style={style}>
      {displayText.join('')}
    </span>
  )
}
