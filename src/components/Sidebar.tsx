import { useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const KprLink = ({
  item,
  isOpen,
  onClick,
}: {
  item: { label: string; href: string };
  isOpen: boolean;
  onClick: () => void;
}) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  const animateText = useCallback(() => {
    if (!textRef.current) return;

    // Kill existing animation
    if (animationRef.current) animationRef.current.kill();

    const chars = LETTERS;
    const originalText = item.label;
    const length = originalText.length;
    const proxy = { value: 0 };

    animationRef.current = gsap.to(proxy, {
      value: length,
      duration: 0.8,
      ease: "none",
      onUpdate: () => {
        if (!textRef.current) return;
        const progress = Math.floor(proxy.value);

        const scrambled = originalText
          .split("")
          .map((_, index) => {
            if (index < progress) {
              return originalText[index]; // Revealed char
            }
            return chars[Math.floor(Math.random() * chars.length)]; // Random char
          })
          .join("");

        textRef.current.innerText = scrambled;
      },
      onComplete: () => {
        if (textRef.current) textRef.current.innerText = originalText;
      },
    });
  }, [item.label]);

  const resetText = useCallback(() => {
    if (animationRef.current) animationRef.current.kill();
    if (textRef.current) textRef.current.innerText = item.label;
  }, [item.label]);

  useEffect(() => {
    if (isOpen) {
      animateText();
    } else {
      resetText();
    }
  }, [isOpen, animateText, resetText]);

  return (
    <Link
      to={item.href}
      onClick={onClick}
      onMouseEnter={animateText}
      onMouseLeave={resetText}
      className="group relative flex w-auto max-w-full items-center gap-4 px-4 py-1 pr-10 pl-0 transition-all duration-300 md:w-96 md:max-w-md md:pr-14"
      style={{
        clipPath:
          "polygon(0 0, 100% 0, calc(100% - 16px) 70%, calc(100% - 8px) 100%, 0 100%)",
      }}
    >
      <div className="absolute inset-0 z-0 hidden h-full w-full -translate-x-full bg-[#00FCCE] opacity-0 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 md:block" />
      <span
        ref={textRef}
        className="relative z-10 pl-2 font-['Unison_Pro'] text-2xl leading-normal font-bold tracking-[0.04rem] text-white transition-transform duration-300 md:text-4xl"
      >
        {item.label}
      </span>
    </Link>
  );
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  // Prevent scrolling when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const menuItems = [
    { label: "HOME", href: "/" },
    { label: "EVENTS", href: "/events" },
    { label: "WORKSHOPS", href: "/workshops" },
    { label: "ABOUT", href: "/about" },
    { label: "CONTACT", href: "/contacts" },
    { label: "MAP", href: "/map" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-60 bg-black/60 backdrop-blur-sm transition-opacity duration-700 ease-in-out ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div
        className={`pointer-events-auto fixed top-0 left-0 z-70 h-full w-full transform overflow-hidden bg-background text-white opacity-0 shadow-2xl transition-all duration-700 ease-in-out md:fixed md:top-10 md:right-16 md:bottom-10 md:left-36 md:h-auto md:w-auto md:translate-x-0 md:rounded-xl ${
          isOpen
            ? "translate-x-0 opacity-100 md:[clip-path:inset(0_0_0_0)]"
            : "-translate-x-full md:[clip-path:inset(0_100%_0_0)]"
        }`}
        style={{ fontFamily: "ValorantFont" }}
      >
        <div className="flex h-full w-full flex-col">
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 flex h-10 w-10 items-center justify-center text-white transition-all duration-300 md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* --- Section 1: Navigation --- */}
          <div className="flex min-h-0 flex-1 flex-row">
            {/* Left Content */}
            <div className="flex flex-1 flex-col justify-center p-8">
              <nav className="pl-5">
                <div className="grid grid-cols-[auto_max-content_1fr] items-center gap-x-3 gap-y-1">
                  <div className="flex items-center">
                    <div className="h-0 w-0 border-y-[5px] border-l-8 border-y-transparent border-l-primary" />
                  </div>
                  <span className="font-['Unison_Pro'] text-sm leading-normal font-light tracking-[0.02rem] text-white">
                    DISCOVER
                  </span>
                  <div className="col-start-2 row-start-2 flex flex-col gap-1 md:col-start-3 md:pl-0">
                    {menuItems.map((item) => (
                      <KprLink
                        key={item.label}
                        item={item}
                        isOpen={isOpen}
                        onClick={onClose}
                      />
                    ))}
                  </div>
                </div>
              </nav>
            </div>

            {/* Vertical Line Segment */}
            <div className="hidden w-px bg-border-custom md:block" />

            {/* Right: Close Button (Desktop) */}
            <div className="hidden w-20 flex-col items-center pt-4 md:flex">
              <button
                onClick={onClose}
                className="group flex h-10 w-10 items-center justify-center transition-all duration-300 hover:rotate-90 hover:text-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* === Horizontal Line 2 === */}
          <div className="h-px w-full bg-border-custom" />

          {/* --- Section 3: Footer --- */}
          <div className="flex flex-row">
            {/* Left Content */}
            <div className="flex flex-1 flex-col justify-center p-8">
              <p className="font-sans text-sm text-gray-400">© 2026 Agnitus</p>
            </div>

            {/* Vertical Line Segment */}
            <div className="w-px bg-border-custom" />

            {/* Right: Social Link */}
            <div className="flex w-20 flex-col items-center justify-center">
              <a
                href="#"
                className="group flex h-10 w-10 items-center justify-center transition-all duration-300 hover:text-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
