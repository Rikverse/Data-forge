import React, { useEffect, useRef, useState } from 'react';

interface LiquidBackgroundProps {
  reducedMotion?: boolean;
}

export const LiquidBackground: React.FC<LiquidBackgroundProps> = ({
  reducedMotion = false,
}) => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0.5, y: 0.3 });
  const [isTouch, setIsTouch] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check touch device
    if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
      setIsTouch(true);
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (reducedMotion) return;
      const width = window.innerWidth || 1000;
      const height = window.innerHeight || 800;
      setMousePos({
        x: e.clientX / width,
        y: e.clientY / height,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reducedMotion]);

  // Subtle parallax offsets based on mouse position
  const offsetX1 = isTouch || reducedMotion ? 0 : (mousePos.x - 0.5) * 30;
  const offsetY1 = isTouch || reducedMotion ? 0 : (mousePos.y - 0.5) * 25;
  const offsetX2 = isTouch || reducedMotion ? 0 : (mousePos.x - 0.5) * -20;
  const offsetY2 = isTouch || reducedMotion ? 0 : (mousePos.y - 0.5) * -18;

  return (
    <div
      id="liquid-background-atmosphere"
      ref={containerRef}
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Base Warm Atmosphere Canvas */}
      <div className="absolute inset-0 bg-[#FAF8F5]" />

      {/* 2. Soft Ambient Gradient Blobs (Apple Liquid Aesthetic) */}
      <div
        className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full blur-[110px] opacity-45 mix-blend-multiply transition-transform duration-1000 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.45) 0%, rgba(245, 158, 11, 0.15) 50%, transparent 70%)',
          transform: `translate3d(${offsetX1}px, ${offsetY1}px, 0)`,
        }}
      />
      <div
        className="absolute top-[20%] -right-[15%] w-[50vw] h-[50vw] rounded-full blur-[130px] opacity-35 mix-blend-multiply transition-transform duration-1000 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.35) 0%, rgba(253, 186, 116, 0.15) 50%, transparent 75%)',
          transform: `translate3d(${offsetX2}px, ${offsetY2}px, 0)`,
        }}
      />
      <div
        className="absolute top-[60%] left-[15%] w-[45vw] h-[45vw] rounded-full blur-[120px] opacity-30 mix-blend-multiply transition-transform duration-1000 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(224, 231, 255, 0.55) 0%, rgba(254, 215, 170, 0.25) 50%, transparent 70%)',
          transform: `translate3d(${offsetX1 * 0.7}px, ${offsetY1 * 0.7}px, 0)`,
        }}
      />

      {/* 3. Subtle Cursor Lighting Highlight (Soft radial glow near pointer) */}
      {!isTouch && !reducedMotion && (
        <div
          className="absolute w-96 h-96 rounded-full blur-[80px] pointer-events-none opacity-25 mix-blend-soft-light transition-all duration-300 ease-out"
          style={{
            left: `${mousePos.x * 100}%`,
            top: `${mousePos.y * 100}%`,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.8) 0%, rgba(255, 255, 255, 0.3) 40%, transparent 75%)',
          }}
        />
      )}

      {/* 4. Elegant Continuous Liquid Wave Layer */}
      <div className="absolute inset-0 opacity-[0.22] overflow-hidden">
        <svg
          className={`absolute bottom-0 left-0 w-[200%] h-[420px] object-cover ${
            reducedMotion ? '' : 'animate-[liquidWaveSlow_24s_linear_infinite]'
          }`}
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="liquidGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.25" />
              <stop offset="35%" stopColor="#EA580C" stopOpacity="0.18" />
              <stop offset="70%" stopColor="#FDE68A" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          <path
            fill="url(#liquidGrad1)"
            d="M0,160 C320,240 420,80 720,160 C1020,240 1120,90 1440,160 L1440,320 L0,320 Z"
          />
        </svg>

        {/* Secondary overlapping wave for layered refraction & depth */}
        <svg
          className={`absolute bottom-0 left-0 w-[220%] h-[380px] object-cover opacity-80 ${
            reducedMotion ? '' : 'animate-[liquidWaveSecondary_32s_linear_infinite]'
          }`}
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="liquidGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#93C5FD" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <path
            fill="url(#liquidGrad2)"
            d="M0,192 C280,100 520,260 800,180 C1080,100 1280,240 1440,192 L1440,320 L0,320 Z"
          />
        </svg>
      </div>

      {/* 5. Very Faint Tactile Frost Texture (Physical glass refraction feel) */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.015] pointer-events-none">
        <filter id="liquidNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#liquidNoise)" />
      </svg>
    </div>
  );
};
