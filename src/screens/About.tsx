import { useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AboutText from "../sections/AboutText";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const { setRevealed } = useOutletContext<{
    setRevealed: (val: boolean) => void;
  }>();
  const container = useRef<HTMLDivElement>(null);
  const leftImage = useRef<HTMLImageElement>(null);
  const rightImage = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setRevealed(true);
  }, [setRevealed]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isDesktop } = context.conditions as {
            isDesktop: boolean;
          };

          // Entrance Animation for Images
          const entranceTl = gsap.timeline({ delay: 1 }); // Start after text animation roughly

          entranceTl.from([leftImage.current, rightImage.current], {
            y: 100,
            opacity: 0,
            duration: 1.2,
            stagger: 0.3,
            ease: "power3.out",
          });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: container.current,
              start: "top top",
              end: "+=100%",
              scrub: 1,
              pin: true,
            },
          });

          // Text moves up and fades out
          tl.to(
            textRef.current,
            {
              y: -150,
              opacity: 0,
              duration: 1,
              ease: "power2.inOut",
            },
            "start"
          );

          // Images expand
          if (isDesktop) {
            tl.to(
              leftImage.current,
              {
                width: "50vw",
                height: "100vh",
                top: 0,
                left: 0,
                borderRadius: 0,
                rotate: 0,
                duration: 1,
                ease: "power1.out",
              },
              "start"
            );

            tl.to(
              rightImage.current,
              {
                width: "50vw",
                height: "100vh",
                top: 0,
                right: 0,
                borderRadius: 0,
                rotate: 0,
                duration: 1,
                ease: "power1.out",
              },
              "start"
            );
          } else {
            // Mobile: Stack images vertically
            tl.to(
              leftImage.current,
              {
                width: "100vw",
                height: "50vh",
                top: 0,
                left: 0,
                borderRadius: 0,
                rotate: 0,
                duration: 1,
                ease: "power1.out",
              },
              "start"
            );

            tl.to(
              rightImage.current,
              {
                width: "100vw",
                height: "50vh",
                top: "50vh", // Starts at the middle
                right: "auto", // Reset right
                left: 0,
                borderRadius: 0,
                rotate: 0,
                duration: 1,
                ease: "power1.out",
              },
              "start"
            );
          }

          // Logo appears at the center at the end
          tl.fromTo(
            logoRef.current,
            {
              opacity: 0,
              scale: 0.5,
            },
            {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              ease: "back.out(1.7)",
            },
            "-=0.2"
          );

          // Mask fades in smoothly
          tl.to(
            maskRef.current,
            {
              opacity: 0.2,
              duration: 1.5,
              ease: "power2.out",
            },
            "-=0.8"
          );
        }
      );
    },
    { scope: container }
  );

  return (
    <div
      ref={container}
      className="relative flex min-h-screen w-full flex-col overflow-hidden"
    >
      <div ref={textRef} className="z-10 pt-20">
        <AboutText />
      </div>

      {/* Animated Images */}
      {/* Left Image (Bike) */}
      <img
        ref={leftImage}
        src="/bike.png"
        alt="Bike"
        className="absolute bottom-32 left-[5%] z-50 h-[200px] w-[180px] rounded-t-2xl object-cover sm:left-[10%] sm:h-[250px] sm:w-[200px] md:-bottom-32 md:left-[15%] md:h-[300px] md:w-[250px] lg:-bottom-40 lg:left-[20%] lg:h-[350px] lg:w-[300px] xl:-bottom-48 xl:left-[28%] xl:h-[400px] xl:w-[350px]"
      />

      {/* Right Image (Sitara) */}
      <img
        ref={rightImage}
        src="/sitara.png"
        alt="Sitara"
        className="absolute right-[5%] bottom-20 z-50 h-[200px] w-[180px] rounded-t-2xl object-cover sm:right-[10%] sm:h-[250px] sm:w-[200px] md:right-[15%] md:-bottom-48 md:h-[300px] md:w-[250px] lg:right-[20%] lg:-bottom-64 lg:h-[350px] lg:w-[300px] xl:right-[28%] xl:-bottom-72 xl:h-[400px] xl:w-[350px]"
      />

      {/* Overlay Mask */}
      <div
        ref={maskRef}
        className="pointer-events-none absolute inset-0 z-10 bg-black opacity-0"
      />

      {/* Central Logo - revealed at the end */}
      <div className="pointer-events-none absolute inset-0 z-60 flex items-center justify-center">
        <img
          ref={logoRef}
          src="/logo.svg"
          alt="Agnitus Logo"
          className="h-32 w-32 opacity-0 md:size-80"
        />
      </div>
    </div>
  );
}
