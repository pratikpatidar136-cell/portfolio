"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SpotlightHoverCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: string;
  glowSize?: number;
}

export const SpotlightHoverCard = ({
  children,
  className,
  glowColor = "rgba(99, 102, 241, 0.15)",
  glowSize = 350,
  ...props
}: SpotlightHoverCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "glass-card relative overflow-hidden rounded-2xl p-6 select-none",
        className
      )}
      {...props}
    >
      {/* Dynamic Cursor Glow Overlay */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(${glowSize}px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 80%)`,
        }}
      />
      
      {/* Content wrapper to float above glow */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
