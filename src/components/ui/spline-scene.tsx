"use client";

import React, { Suspense, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

// Lazy load the Spline component to keep the initial page bundle lightweight
const Spline = React.lazy(() => import("@splinetool/react-spline"));

// React Class Error Boundary to catch deep runtime parse/buffer errors thrown by Spline
class SplineErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.warn("Spline parsed incorrectly or network blocked, invoking fallback engine:", error, errorInfo);
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

interface SplineSceneProps {
  sceneUrl: string;
}

export const SplineScene = ({ sceneUrl }: SplineSceneProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Mouse Coordinate tracking for local 3D CSS Luffy Avatar fallback
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      setMousePos({
        x: (e.clientX - centerX) / (rect.width / 2),
        y: (e.clientY - centerY) / (rect.height / 2),
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Safe 3D tilt coordinates
  const rotateX = -mousePos.y * 20; // up/down tilt
  const rotateY = mousePos.x * 20;  // left/right tilt

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
    >
      {/* Loading indicator */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center">
          <div className="relative flex h-48 w-48 items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute h-40 w-40 rounded-full border border-dashed border-indigo-500/20"
            />
            <div className="spinner relative z-10" />
          </div>
          <p className="mt-4 text-xs font-semibold tracking-widest text-zinc-500 uppercase">
            Initializing 3D Space
          </p>
        </div>
      )}

      {/* Spline 3D Canvas */}
      {!hasError && (
        <Suspense fallback={null}>
          <div className="h-full w-full transition-opacity duration-1000" style={{ opacity: isLoaded ? 1 : 0 }}>
            <SplineErrorBoundary
              onError={() => {
                setHasError(true);
                setIsLoaded(true);
              }}
            >
              <Spline
                scene={sceneUrl}
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                  setHasError(true);
                  setIsLoaded(true);
                }}
              />
            </SplineErrorBoundary>
          </div>
        </Suspense>
      )}

      {/* 100% OFFLINE STUNNING 3D CSS MONKEY D. LUFFY AVATAR */}
      {hasError && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center p-8 select-none"
          style={{ perspective: "1000px" }}
        >
          {/* Main 3D Container */}
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            transition={{ type: "spring", stiffness: 180, damping: 25 }}
            className="relative flex h-96 w-96 flex-col items-center justify-center rounded-full"
          >
            {/* Background glowing aura */}
            <div className="pointer-events-none absolute inset-12 rounded-full bg-orange-500/5 blur-[80px]" />

            {/* LUFFY CHARACTER WRAPPER */}
            <div 
              style={{ transformStyle: "preserve-3d" }}
              className="relative flex flex-col items-center justify-center"
            >
              
              {/* 1. STRAW HAT (Shifted far top and extreme forward translateZ(55px)) */}
              <div 
                style={{ 
                  transform: "translateY(-85px) rotateX(-5deg) rotateY(-2deg) translateZ(65px)", 
                  transformStyle: "preserve-3d" 
                }}
                className="absolute z-30 flex flex-col items-center"
              >
                {/* Hat Brim */}
                <div className="h-10 w-72 rounded-full bg-gradient-to-b from-[#eab308] to-[#ca8a04] border border-[#a16207] shadow-xl relative flex justify-center items-center">
                  
                  {/* Hat Crown (Center Cylinder) */}
                  <div 
                    style={{ transform: "translateY(-20px) translateZ(10px)" }}
                    className="absolute h-24 w-36 rounded-t-full bg-gradient-to-b from-[#facc15] to-[#ca8a04] border-t border-x border-[#a16207] shadow-inner"
                  >
                    {/* Iconic Red Band Ribbon */}
                    <div className="absolute bottom-0 w-full h-6 bg-red-600 border-y border-red-700 shadow-md" />
                  </div>

                </div>
              </div>

              {/* 2. MESSY BLACK HAIR SPIKES (Surrounding and layered behind the hat/face) */}
              <div 
                style={{ transform: "translateZ(15px)" }}
                className="absolute z-20 w-56 h-56 pointer-events-none"
              >
                {/* Top/Front Spikes */}
                <div className="absolute -top-12 left-8 w-10 h-10 bg-zinc-950 rotate-45 rounded-tl-2xl" />
                <div className="absolute -top-14 left-24 w-12 h-12 bg-zinc-950 rotate-12 rounded-tl-3xl" />
                <div className="absolute -top-10 right-10 w-10 h-10 bg-zinc-950 -rotate-45 rounded-tr-2xl" />
                
                {/* Left Spikes */}
                <div className="absolute top-8 -left-6 w-12 h-8 bg-zinc-950 -rotate-12 rounded-l-full" />
                <div className="absolute top-20 -left-8 w-14 h-10 bg-zinc-950 -rotate-45 rounded-l-full" />
                <div className="absolute top-32 -left-4 w-12 h-8 bg-zinc-950 -rotate-12 rounded-l-full" />

                {/* Right Spikes */}
                <div className="absolute top-8 -right-6 w-12 h-8 bg-zinc-950 rotate-12 rounded-r-full" />
                <div className="absolute top-20 -right-8 w-14 h-10 bg-zinc-950 rotate-45 rounded-r-full" />
                <div className="absolute top-32 -right-4 w-12 h-8 bg-zinc-950 rotate-12 rounded-r-full" />
              </div>

              {/* 3. FACE MAIN BODY (Centered at translateZ(0px)) */}
              <div 
                style={{ transform: "translateZ(0px)", transformStyle: "preserve-3d" }}
                className="relative flex h-48 w-44 flex-col items-center justify-center rounded-[40px] bg-[#fed7aa] border border-[#fdba74] shadow-2xl"
              >
                {/* Ears */}
                <div className="absolute -left-5 top-20 h-12 w-6 rounded-l-full bg-[#fca5a5] border-l border-y border-[#fdba74]" />
                <div className="absolute -right-5 top-20 h-12 w-6 rounded-r-full bg-[#fca5a5] border-r border-y border-[#fdba74]" />

                {/* Expressive Anime Eyes (React to cursor offsets) */}
                <div 
                  className="absolute top-14 flex gap-8 justify-center items-center transition-transform duration-200"
                  style={{
                    transform: `translateX(${mousePos.x * 10}px) translateY(${mousePos.y * 5}px)`,
                  }}
                >
                  {/* Left Eye */}
                  <div className="relative h-9 w-9 rounded-full bg-white border border-[#f59e0b]/20 flex items-center justify-center">
                    <div className="h-3.5 w-3.5 rounded-full bg-zinc-900 flex items-center justify-center">
                      {/* Pupils reflection glare */}
                      <div className="absolute top-1.5 left-1.5 h-1.5 w-1.5 rounded-full bg-white" />
                    </div>
                  </div>

                  {/* Right Eye */}
                  <div className="relative h-9 w-9 rounded-full bg-white border border-[#f59e0b]/20 flex items-center justify-center">
                    <div className="h-3.5 w-3.5 rounded-full bg-zinc-900 flex items-center justify-center">
                      <div className="absolute top-1.5 left-1.5 h-1.5 w-1.5 rounded-full bg-white" />
                    </div>
                  </div>
                </div>

                {/* THE FAMOUS SCAR UNDER HIS LEFT EYE (Screen Right, translateZ(30px) for depth!) */}
                <div 
                  style={{ transform: "translateZ(30px)" }}
                  className="absolute top-[92px] right-8 flex flex-col items-center pointer-events-none"
                >
                  {/* Curved main scar line */}
                  <svg className="w-8 h-3 text-red-700/80" fill="none" viewBox="0 0 30 10">
                    <path d="M 2,2 C 10,8 20,8 28,2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Stitch marks */}
                    <path d="M 9,1 L 11,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 19,1 L 21,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Small Anime Nose */}
                <div className="absolute top-24 w-1.5 h-2.5 bg-[#f97316]/50 rounded-full" />

                {/* ICONIC LUFFY WIDE-OPEN TOOTH GRIN (translateZ(25px)) */}
                <div 
                  style={{ transform: "translateZ(25px)" }}
                  className="absolute top-28 h-12 w-28 overflow-hidden rounded-b-full bg-gradient-to-b from-[#be123c] to-[#9f1239] border-t-2 border-zinc-900 flex flex-col items-center justify-start shadow-inner"
                >
                  {/* Top Teeth Line */}
                  <div className="w-full h-3.5 bg-white border-b border-zinc-900" />
                  {/* Tongue glow */}
                  <div className="mt-1 h-5 w-12 rounded-t-full bg-pink-500" />
                </div>
              </div>

              {/* 4. RED VEST COLLAR & CHEST SCAR (Shifted bottom and backward translateZ(-15px)) */}
              <div 
                style={{ 
                  transform: "translateY(95px) translateZ(-15px)", 
                  transformStyle: "preserve-3d" 
                }}
                className="absolute z-10 flex flex-col items-center"
              >
                {/* Skin Neck/Chest */}
                <div className="w-24 h-12 bg-[#fed7aa] border-x border-[#fdba74] flex justify-center items-center relative">
                  
                  {/* Iconic X-SHAPED CHEST SCAR */}
                  <svg className="absolute top-4 w-12 h-8 text-red-700/60 animate-pulse-slow" fill="none" viewBox="0 0 40 24">
                    <path d="M 5,4 L 35,20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    <path d="M 35,4 L 5,20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>

                </div>

                {/* Red Vest Shoulders */}
                <div className="w-48 h-10 rounded-t-3xl bg-gradient-to-r from-red-700 via-red-600 to-red-700 border-x border-t border-red-800 shadow-md flex justify-around px-10">
                  {/* Left Collar flap */}
                  <div className="h-6 w-5 bg-red-800 rounded-b-md transform -skew-x-12" />
                  {/* Right Collar flap */}
                  <div className="h-6 w-5 bg-red-800 rounded-b-md transform skew-x-12" />
                </div>
              </div>

            </div>

            {/* Glowing platform ring */}
            <div 
              style={{ transform: "translateY(160px) rotateX(90deg)" }}
              className="absolute h-10 w-48 rounded-full bg-yellow-500/10 blur-[8px]"
            />
          </motion.div>

          {/* Luffy Tag */}
          <div className="text-center mt-8">
            <h4 className="text-xs font-black tracking-widest text-yellow-500 uppercase flex items-center justify-center gap-1.5">
              <span>👒</span> MONKEY D. LUFFY <span>🏴‍☠️</span>
            </h4>
            <p className="mt-1 text-[11px] text-zinc-500 max-w-[260px]">
              "I'm gonna be the King of the Pirates!" <br />
              Interactive anime 3D scroll-tracking sandbox active.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
