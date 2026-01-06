import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import Landing from '../sections/Landing'
import ComingSoon from '../components/ComingSoon'

export default function Home() {
  const [uiVisible, setUiVisible] = useState(false)
  const context = useOutletContext<{ setRevealed: (val: boolean) => void }>()
  const setRevealed = context?.setRevealed || (() => { })

  const handleReveal = () => {
    setUiVisible(true)
    setRevealed(true)
  }

  return (
    <div>
      {/* Pass callback to trigger UI reveal when knife reaches peak */}
      <Landing onPeak={handleReveal} />

      {/* UI Wrapper with Fade Transition */}
      <div
        style={{
          opacity: uiVisible ? 1 : 0,
          transition: 'opacity 1.5s ease-in-out', // Smooth fade in
          pointerEvents: uiVisible ? 'auto' : 'none'
        }}
        className="relative z-10" // Ensure it sits above background
      >
        <section className="min-h-screen">
          <ComingSoon title="AGNITUS" />
        </section>
      </div>
    </div>
  )
}