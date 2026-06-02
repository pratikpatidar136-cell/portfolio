"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type DockItem = {
  title: string;
  icon: React.ReactNode;
  href: string;
};

interface FloatingDockProps {
  items: DockItem[];
  className?: string;
}

export const FloatingDock = ({ items, className }: FloatingDockProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center justify-center",
        className
      )}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
        className="glass-panel flex items-center gap-3 rounded-full px-4 py-2.5 shadow-2xl shadow-black/80"
      >
        {items.map((item, idx) => (
          <a
            key={item.title}
            href={item.href}
            onClick={(e) => handleScroll(e, item.href)}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-zinc-400 transition-colors hover:text-zinc-50"
          >
            {/* Background pill tracker */}
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  layoutId="dock-hover"
                  className="absolute inset-0 z-0 rounded-full bg-zinc-800/60"
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1.05, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                />
              )}
            </AnimatePresence>

            {/* Icon */}
            <span className="relative z-10">{item.icon}</span>

            {/* Tooltip */}
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: -45, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-50 whitespace-nowrap rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs font-medium text-zinc-200 shadow-xl"
                >
                  {item.title}
                </motion.span>
              )}
            </AnimatePresence>
          </a>
        ))}
      </motion.div>
    </div>
  );
};
