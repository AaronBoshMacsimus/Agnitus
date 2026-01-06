import {
  useEffect,
  useState,
  Suspense,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import Loaded from "../screens/loaded";

const TEXT = "AGNITUS";

// ... imports

// ... imports

interface LandingProps {
  onPeak?: () => void;
}

export default function Landing({ onPeak }: LandingProps) {
  gsap.registerPlugin(ScrollTrigger);
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileWrapperRef = useRef<HTMLDivElement>(null);
  const desktopWrapperRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const canvasScrollRef = useRef<HTMLDivElement>(null);

  const [visibleCount, setVisibleCount] = useState(0);
  const [contentVisible, setContentVisible] = useState(false); // Control DOM visibility
  const [isMobile] = useState(() => window.innerWidth < 768);

  const handlePeak = useCallback(() => {
    setContentVisible(true);
    if (onPeak) onPeak();
  }, [onPeak]);

  useEffect(() => {
    const timeoutDuration = isMobile ? 2000 : 5000;

    const timer = setTimeout(() => {
      if (!contentVisible) {
        handlePeak();
      }
    }, timeoutDuration);

    return () => clearTimeout(timer);
  }, [contentVisible, handlePeak, isMobile]);

  useEffect(() => {
    // Only run the text animation if content is visible
    if (!contentVisible) return;

    const ctx = gsap.context(() => {
      // ... existing gsap logic ...
      gsap.to(
        { value: 0 },
        {
          value: TEXT.length,
          duration: 1.5,
          delay: 0.5,
          ease: "none",
          onUpdate: function () {
            setVisibleCount(Math.round(this.targets()[0].value));
          },
        }
      );
    });
    return () => ctx.revert();
  }, [contentVisible]);

  useLayoutEffect(() => {
    if (!contentVisible) return;

    const ctx = gsap.context(() => {
      // Mobile Scroll Animation
      if (mobileWrapperRef.current) {
        gsap.fromTo(
          mobileWrapperRef.current.children,
          { opacity: 1, y: 0 },
          {
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "40% top",
              scrub: true,
            },
            y: -50,
            opacity: 0,
            stagger: 0.05,
            ease: "power1.out",
          }
        );
      }

      // Desktop Scroll Animation
      if (desktopWrapperRef.current) {
        gsap.fromTo(
          desktopWrapperRef.current.children,
          { opacity: 1, y: 0 },
          {
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "40% top",
              scrub: true,
            },
            y: -100,
            opacity: 0,
            stagger: 0.1,
            ease: "power1.out",
          }
        );
      }

      // 3D Canvas Scroll Animation
      if (canvasScrollRef.current) {
        gsap.fromTo(
          canvasScrollRef.current,
          { opacity: 1, y: 0 },
          {
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "40% top",
              scrub: true,
            },
            y: -100,
            opacity: 0,
            ease: "power1.out",
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [contentVisible]);

  // ... renderText helper ...
  const renderText = () => (
    <>
      {TEXT.split("").map((char, index) => (
        <span
          key={index}
          style={{
            opacity: index < visibleCount ? 1 : 0,
            transition: "opacity 0.1s ease-out",
          }}
        >
          {char}
        </span>
      ))}
    </>
  );

  return (
    <div ref={containerRef} className="relative h-dvh w-full overflow-x-hidden">
      {/* 3D Model Overlay - ALWAYS VISIBLE */}
      <div
        ref={canvasWrapperRef}
        className={`absolute inset-0 z-25 transition-opacity duration-800 ease-in-out ${
          isMobile && !contentVisible ? "opacity-0" : "opacity-100"
        }`}
      >
        <div ref={canvasScrollRef} className="w-full h-full">
          <Canvas
            className="w-full h-full"
            dpr={[1, 2]}
            camera={{ position: [0, 0, 4], fov: 50 }}
            gl={{ alpha: true }}
          >
            {/* Lighting ... */}
            <Environment preset="city" />
            <hemisphereLight intensity={0.5} groundColor="black" />
            <directionalLight position={[5, 10, 7]} intensity={1.0} />
            <spotLight
              position={[0, 8, 0]}
              angle={0.3}
              penumbra={1}
              intensity={0.8}
            />

            <Suspense fallback={null}>
              <Loaded onPeak={handlePeak} isMobile={isMobile} />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* Mobile View */}
      <div
        ref={mobileWrapperRef}
        className="relative flex h-full w-full flex-col overflow-x-hidden md:hidden"
        style={{
          opacity: contentVisible ? 1 : 0,
          transition: "opacity 1.5s ease-in-out",
        }}
      >
        {/* ... Mobile Layout ... */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <img
            src="/mobile_logo.svg"
            alt="Mobile Background"
            className="h-full w-full object-contain opacity-50"
          />
        </div>
        <div className="pointer-events-none z-20 mt-32 flex shrink-0 flex-col items-center justify-center text-center">
          <h1
            className="text-7xl leading-none font-normal text-white"
            style={{ fontFamily: "ValorantFont" }}
          >
            AGNITUS
          </h1>
          <p
            className="mt-2 text-4xl font-normal text-white"
            style={{ fontFamily: "ValorantFont" }}
          >
            2026
          </p>
        </div>
        <div className="pointer-events-none relative z-10 flex min-h-0 flex-1 items-end justify-center">
          <img
            src="/p.svg"
            alt="Phoenix"
            className="absolute -bottom-[2vh] left-[25%] h-[115%] w-auto max-w-none -translate-x-1/2 object-bottom drop-shadow-[25px_25px_35px_rgba(0,0,0,0.95)]"
          />
        </div>
      </div>

      {/* Desktop View */}
      <div
        ref={desktopWrapperRef}
        className="relative hidden h-full w-full md:block"
        style={{
          opacity: contentVisible ? 1 : 0,
          transition: "opacity 1.5s ease-in-out",
        }}
      >
        <div className="flex h-dvh w-full items-center justify-center">
          <img
            src="/main_logo.svg"
            alt="Main Logo"
            className="h-full w-full object-contain"
          />
        </div>

        {/* Layer 1: White Text Fill */}
        <div className="pointer-events-none absolute inset-0 z-0 flex items-end justify-center pb-3">
          <h1
            className="text-[14vw] leading-none font-normal text-[#F5F5F5]"
            style={{ fontFamily: "ValorantFont" }}
          >
            {renderText()}
          </h1>
        </div>

        {/* Layer 2: Jett Character */}
        <div className="pointer-events-none absolute bottom-0 left-0 z-10 flex h-screen w-full items-end justify-end pr-[10%]">
          <img
            src="/j.svg"
            alt="Jett"
            className="h-[115%] w-auto max-w-none object-contain object-bottom drop-shadow-[25px_25px_35px_rgba(0,0,0,0.85)]"
          />
        </div>

        {/* Layer 3: Text Stroke */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-end justify-center pb-3">
          <h1
            className="text-[14vw] leading-none font-normal text-transparent"
            style={{
              fontFamily: "ValorantFont",
              WebkitTextStrokeWidth: "1.84px",
              WebkitTextStrokeColor: "#F5F5F5",
            }}
          >
            {renderText()}
          </h1>
        </div>
      </div>
    </div>
  );
}
