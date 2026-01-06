import { useState, useEffect } from "react";
import { useProgress } from "@react-three/drei";

interface LoadingProps {
  onComplete?: () => void;
}

function Loading({ onComplete }: LoadingProps) {
  const { progress: modelProgress } = useProgress();
  const [isExiting, setIsExiting] = useState(false);
  const progress = Math.round(modelProgress);

  // Sync visual progress directly with actual model progress
  useEffect(() => {
    if (modelProgress === 100 && !isExiting) {
      // Use setTimeout to avoid strictly synchronous state update during effect which causes warnings
      setTimeout(() => setIsExiting(true), 0);

      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 1000);
    }
  }, [modelProgress, onComplete, isExiting]);

  // Safety valve: Force complete after 8 seconds max (in case progress gets stuck)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (onComplete) {
        console.warn("[Loading] Force completing due to timeout");
        onComplete();
      }
    }, 8000);
    return () => clearTimeout(timeout);
  }, [onComplete]);

  const svgHeight = 475;
  const svgWidth = 432;
  return (
    <div className="bg-black w-full h-screen flex justify-center items-center">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-[250px] md:w-[432px] h-auto transition-opacity duration-1000 ease-in-out ${
          isExiting ? "opacity-0" : "opacity-100"
        }`}
      >
        <defs>
          <style>
            {`
                            @keyframes wave {
                                0% { transform: translateX(0); }
                                100% { transform: translateX(-200px); }
                            }
                            @keyframes wave-reverse {
                                0% { transform: translateX(0); }
                                100% { transform: translateX(180px); }
                            }
                            .wave-anim {
                                animation: wave 2s linear infinite;
                            }
                            .wave-anim-2 {
                                animation: wave-reverse 3s linear infinite;
                                opacity: 0.85;
                            }
                        `}
          </style>
          <mask id="fill-mask">
            <g
              transform={`translate(0, ${
                svgHeight - (progress / 100) * (svgHeight + 50)
              })`}
            >
              <path
                className="wave-anim"
                d="M0 0 C 50 25 50 25 100 0 C 150 -25 150 -25 200 0 C 250 25 250 25 300 0 C 350 -25 350 -25 400 0 C 450 25 450 25 500 0 C 550 -25 550 -25 600 0 C 650 25 650 25 700 0 C 750 -25 750 -25 800 0 V 1000 H 0 Z"
                fill="white"
              />
              <path
                className="wave-anim-2"
                d="M0 5 C 45 30 45 30 90 5 C 135 -20 135 -20 180 5 C 225 30 225 30 270 5 C 315 -20 315 -20 360 5 C 405 30 405 30 450 5 C 495 -20 495 -20 540 5 C 585 30 585 30 630 5 C 675 -20 675 -20 720 5 V 1000 H 0 Z"
                fill="white"
              />
            </g>
          </mask>
        </defs>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M153.072 251.099C132.877 222.056 151.295 200.082 173.334 173.785C204.978 136.03 244.088 89.3652 187.113 0.0805664C199.41 42.4811 196.559 83.9908 152.893 132.092C149.748 135.789 146.225 139.631 142.524 143.666C120.003 168.221 90.8875 199.966 100.317 250.03C114.457 337.795 251.631 376.341 312.05 259.472C310.386 289.817 289.451 352.29 219.015 360.129C177.489 367.077 111.367 341.957 90.1577 292.074C83.3889 279.247 78.1517 258.061 78.3947 222.238C57.3669 262.322 54.6936 310.78 85.5277 353.715L3.1861 472.187C155.74 451.047 256.09 449.918 427.9 472.544L334.688 337.86C354.471 309.355 380.809 250.03 307.597 174.493C298.382 165.788 291.34 160.045 285.57 155.34C271.028 143.482 264.572 138.217 251.812 108.754C248.394 132.413 248.653 145.091 256.981 165.585C261.829 175.026 267.566 182.221 272.684 188.641C285.628 204.876 294.624 216.159 275.338 246.289L215.81 160.953L153.072 251.099ZM113.865 380.973L81.9622 426.224C187.225 417.196 245.654 417.821 349.124 426.045L308.132 367.077C250.208 413.753 164.659 416.247 113.865 380.973ZM246.644 272.299L215.81 228.117L182.304 276.04C200.305 285.304 227.039 284.413 246.644 272.299Z"
          stroke="#000000"
          strokeWidth="0.3"
          strokeLinecap="round"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M153.072 251.099C132.877 222.056 151.295 200.082 173.334 173.785C204.978 136.03 244.088 89.3652 187.113 0.0805664C199.41 42.4811 196.559 83.9908 152.893 132.092C149.748 135.789 146.225 139.631 142.524 143.666C120.003 168.221 90.8875 199.966 100.317 250.03C114.457 337.795 251.631 376.341 312.05 259.472C310.386 289.817 289.451 352.29 219.015 360.129C177.489 367.077 111.367 341.957 90.1577 292.074C83.3889 279.247 78.1517 258.061 78.3947 222.238C57.3669 262.322 54.6936 310.78 85.5277 353.715L3.1861 472.187C155.74 451.047 256.09 449.918 427.9 472.544L334.688 337.86C354.471 309.355 380.809 250.03 307.597 174.493C298.382 165.788 291.34 160.045 285.57 155.34C271.028 143.482 264.572 138.217 251.812 108.754C248.394 132.413 248.653 145.091 256.981 165.585C261.829 175.026 267.566 182.221 272.684 188.641C285.628 204.876 294.624 216.159 275.338 246.289L215.81 160.953L153.072 251.099ZM113.865 380.973L81.9622 426.224C187.225 417.196 245.654 417.821 349.124 426.045L308.132 367.077C250.208 413.753 164.659 416.247 113.865 380.973ZM246.644 272.299L215.81 228.117L182.304 276.04C200.305 285.304 227.039 284.413 246.644 272.299Z"
          className="fill-primary"
          mask="url(#fill-mask)"
        />
      </svg>
    </div>
  );
}

export default Loading;
