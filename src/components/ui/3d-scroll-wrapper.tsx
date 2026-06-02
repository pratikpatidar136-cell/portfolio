"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ThreeDScrollWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const ThreeDScrollWrapper = ({ children, className }: ThreeDScrollWrapperProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Calculate 3D rotations, scaling, and depth transitions based on scroll position
  const rotateX = useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [15, 0, 0, -15]);
  const scale = useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [0.93, 1, 1, 0.93]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);
  const z = useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [-100, 0, 0, -100]);

  return (
    <div
      ref={ref}
      style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
      className="w-full flex justify-center py-12"
    >
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          z,
          transformStyle: "preserve-3d",
        }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
};
