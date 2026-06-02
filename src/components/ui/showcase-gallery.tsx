"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Sparkles, Layers, Video } from "lucide-react";

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  software: string[];
  duration?: string;
  client: string;
};

interface ShowcaseGalleryProps {
  items: GalleryItem[];
  categories: string[];
}

// Helper to resolve icon dynamically from category text
const getCategoryIcon = (category: string) => {
  const norm = category.toLowerCase();
  if (norm.includes("video") || norm.includes("edit")) {
    return <Video className="h-4 w-4" />;
  }
  if (norm.includes("3d") || norm.includes("motion") || norm.includes("graphics")) {
    return <Sparkles className="h-4 w-4" />;
  }
  if (norm.includes("vfx") || norm.includes("effects") || norm.includes("compos")) {
    return <Layers className="h-4 w-4" />;
  }
  return <Sparkles className="h-4 w-4" />;
};

export const ShowcaseGallery = ({ items = [], categories = [] }: ShowcaseGalleryProps) => {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filterCategories = ["All", ...categories];

  const filteredItems = items.filter(
    (item) => activeCategory === "All" || item.category === activeCategory
  );

  return (
    <div className="w-full">
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {filterCategories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`relative px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-300 ${
              activeCategory === category
                ? "text-white"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40"
            }`}
          >
            {activeCategory === category && (
              <motion.span
                layoutId="active-tab"
                className="absolute inset-0 rounded-full bg-indigo-600/80 shadow-lg shadow-indigo-600/30"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{category}</span>
          </button>
        ))}
      </div>

      {/* Grid Display */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              key={item.id}
              className="glass-card group overflow-hidden rounded-2xl border border-zinc-800/40"
            >
              {/* Media Preview Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
                <Image
                  src={item.imageUrl || "/images/abstract_3d_geometry.png"}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-85"
                />

                {/* Soft glow hover shadow */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                {/* Duration Tag */}
                {item.duration && (
                  <div className="absolute bottom-3 right-3 rounded bg-black/75 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-zinc-300">
                    {item.duration}
                  </div>
                )}

                {/* Video Play / Graphic View icon overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl">
                    {item.category.toLowerCase().includes("video") ? (
                      <Play className="h-5 w-5 fill-white ml-0.5 animate-pulse" />
                    ) : (
                      <Sparkles className="h-5 w-5 animate-pulse" />
                    )}
                  </div>
                </div>
              </div>

              {/* Meta Info */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                    {getCategoryIcon(item.category)}
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-indigo-400">
                    {item.category}
                  </span>
                </div>
                
                <h3 className="text-sm font-semibold tracking-wide text-zinc-100 group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                
                <p className="mt-1 text-[11px] text-zinc-500">
                  Client: <span className="text-zinc-400">{item.client || "Self"}</span>
                </p>

                {/* Software tags */}
                {item.software && item.software.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1">
                    {item.software.map((sw) => (
                      <span
                        key={sw}
                        className="rounded bg-zinc-900 border border-zinc-800/40 px-2 py-0.5 text-[9px] font-medium tracking-wide text-zinc-400"
                      >
                        {sw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
