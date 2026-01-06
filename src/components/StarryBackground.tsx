import { useEffect, useRef } from "react";

class Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  baseOpacity: number;
  dx: number;
  dy: number;
  twinkleFactor: number;
  twinkleSpeed: number;
  color: string;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 1.5 + 0.5;

    // Mix of Primary and White
    const isMobile = window.innerWidth < 768;
    const primaryColor = isMobile ? "246, 149, 78" : "0, 255, 255";
    this.color = Math.random() > 0.4 ? primaryColor : "255, 255, 255";

    this.baseOpacity = Math.random() * 0.5 + 0.2;
    this.opacity = this.baseOpacity;

    // Random subtle drift direction
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 0.1 + 0.02; // Very slow drift

    this.dx = Math.cos(angle) * speed;
    this.dy = Math.sin(angle) * speed;

    this.twinkleFactor = Math.random() * 10;
    this.twinkleSpeed = (Math.random() - 0.5) * 0.03;
  }

  update(width: number, height: number) {
    // Subtle drift
    this.x += this.dx;
    this.y += this.dy;

    // Pulsating glow/twinkle
    this.twinkleFactor += this.twinkleSpeed;
    // Sine wave for smooth pulsating opacity
    this.opacity = this.baseOpacity + Math.sin(this.twinkleFactor) * 0.2;

    if (this.opacity < 0.1) this.opacity = 0.1;
    if (this.opacity > 1) this.opacity = 1;

    // Wrap around screen
    if (this.x < -10) this.x = width + 10;
    if (this.x > width + 10) this.x = -10;
    if (this.y < -10) this.y = height + 10;
    if (this.y > height + 10) this.y = -10;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;

    // Strong Glow effect
    ctx.shadowBlur = this.size * 6; // Increased blur for more "glow"
    ctx.shadowColor = `rgba(${this.color}, 0.8)`;

    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

export default function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];
    const STAR_COUNT = 150;

    const initStars = () => {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push(new Star(canvas.width, canvas.height));
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Static Ambient Background with Drift
      stars.forEach((star) => {
        star.update(canvas.width, canvas.height);
        star.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" />
  );
}
