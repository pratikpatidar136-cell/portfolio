"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Video,
  Layers,
  Calendar,
  Mail,
  Home,
  ArrowRight,
  Cpu,
  Palette,
  Send,
  CheckCircle2,
} from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";
import { SpotlightHoverCard } from "@/components/ui/spotlight-hover";
import { WebGLModelScene } from "@/components/ui/webgl-model-scene";
import { ShowcaseGallery } from "@/components/ui/showcase-gallery";
import { FloatingDock, DockItem } from "@/components/ui/floating-dock";
import { ThreeDScrollWrapper } from "@/components/ui/3d-scroll-wrapper";

// Bundled static JSON fallback seed to prevent SSR layout shifting
import initialPortfolio from "@/data/portfolio.json";

// Resolves category or service icons dynamically from string names
const getServiceIcon = (iconName: string) => {
  switch (iconName) {
    case "Video":
      return <Video className="h-6 w-6" />;
    case "Sparkles":
      return <Sparkles className="h-6 w-6" />;
    case "Palette":
      return <Palette className="h-6 w-6" />;
    case "Layers":
      return <Layers className="h-6 w-6" />;
    default:
      return <Cpu className="h-6 w-6" />;
  }
};

const getJourneyDotColor = (color: string) => {
  switch (color) {
    case "indigo":
      return "bg-indigo-600 shadow-indigo-600/30";
    case "purple":
      return "bg-purple-600 shadow-purple-600/30";
    case "zinc":
      return "bg-zinc-700 shadow-zinc-700/10";
    default:
      return "bg-indigo-600 shadow-indigo-600/30";
  }
};

export default function HomePage() {
  const [data, setData] = useState(initialPortfolio);
  const [formData, setFormData] = useState({ name: "", email: "", project: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load portfolio database changes dynamically
  useEffect(() => {
    fetch("/api/portfolio?t=" + Date.now())
      .then((res) => res.json())
      .then((json) => {
        if (json && !json.error) {
          setData(json);
        }
      })
      .catch((err) => console.error("Error fetching dynamic portfolio:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.project) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ name: "", email: "", project: "" });
        }, 3500);
      } else {
        alert("Failed to submit proposal scope. Please try again.");
      }
    } catch (err) {
      alert("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const navItems: DockItem[] = [
    { title: "Home", icon: <Home className="h-5 w-5" />, href: "#home" },
    { title: "Services", icon: <Cpu className="h-5 w-5" />, href: "#services" },
    { title: "Gallery", icon: <Layers className="h-5 w-5" />, href: "#gallery" },
    { title: "Journey", icon: <Calendar className="h-5 w-5" />, href: "#journey" },
    { title: "Contact", icon: <Mail className="h-5 w-5" />, href: "#contact" },
  ];

  return (
    <main className="relative flex flex-1 flex-col items-center justify-start overflow-x-hidden bg-black pb-32">
      {/* Absolute Ambient Background Lights */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#6366f1" />
      <div className="pointer-events-none absolute top-[30vh] right-[10%] h-[350px] w-[350px] rounded-full bg-indigo-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute top-[120vh] left-[5%] h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-[130px]" />

      {/* 1. HERO SECTION */}
      <section
        id="home"
        className="relative flex min-h-[92vh] w-full max-w-7xl flex-col items-center justify-center px-6 pt-16 md:flex-row md:px-12 md:pt-0"
      >
        {/* Left Column: Premium Typography & CTAs */}
        <div className="relative z-10 flex flex-1 flex-col items-start justify-center text-left md:pr-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-3.5 py-1 text-xs font-semibold tracking-wider uppercase text-indigo-400"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Premium Creative Sandbox</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl"
          >
            Sculpting Stories <br />
            through <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent">Cinematic Video</span> <br />
            &amp; <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">3D Motion Graphics</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 md:text-lg"
          >
            {data.hero.description}
          </motion.p>

          {/* Quick Metrics Block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-6 border-y border-zinc-900 py-6 w-full max-w-lg"
          >
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-white">{data.hero.globalClients}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mt-0.5">Global Clients</span>
            </div>
            <div className="flex-1 border-l border-zinc-900 pl-6 flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-white">{data.hero.collectiveViews}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mt-0.5">Collective Views</span>
            </div>
            <div className="flex-1 border-l border-zinc-900 pl-6 flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-white">{data.hero.experienceYears}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mt-0.5">Visual Design Exp</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <a
              href="#contact"
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 hover:shadow-indigo-600/30"
            >
              Start Project Proposal
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#gallery"
              className="flex h-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/20 px-6 text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white"
            >
              Explore Showcase
            </a>
          </motion.div>
        </div>

        {/* Right Column: Real Luffy 3D WebGL Model */}
        <div className="relative flex h-[50vh] w-full items-center justify-center md:h-[80vh] md:flex-1">
          <WebGLModelScene modelPath="/models/textured.glb" />
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <ThreeDScrollWrapper className="w-full max-w-7xl px-6 md:px-12">
        <section id="services" className="w-full">
          <div className="text-center md:text-left mb-16">
            <h2 className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Core Expertise</h2>
            <h3 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              High-Impact Creative Capabilities
            </h3>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-500">
              A fusion of technical expertise and premium artistic direction to build unforgettable visual aesthetics.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.services.map((s: any) => (
              <SpotlightHoverCard key={s.id} className="flex flex-col justify-between h-72">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  {getServiceIcon(s.icon)}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white tracking-wide">{s.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {s.description}
                  </p>
                </div>
              </SpotlightHoverCard>
            ))}
          </div>
        </section>
      </ThreeDScrollWrapper>

      {/* 3. SHOWCASE GALLERY SECTION */}
      <ThreeDScrollWrapper className="w-full max-w-7xl px-6 md:px-12">
        <section id="gallery" className="w-full">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Selected Pieces</h2>
            <h3 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              The Creative Visual Archive
            </h3>
            <p className="mt-4 mx-auto max-w-xl text-sm leading-relaxed text-zinc-500">
              A curated exhibit of my latest premium deliverables. Filter by category to view the asset structures.
            </p>
          </div>

          <ShowcaseGallery items={data.showcase} categories={data.categories} />
        </section>
      </ThreeDScrollWrapper>

      {/* 4. CREATIVE JOURNEY TIMELINE */}
      <ThreeDScrollWrapper className="w-full max-w-3xl px-6">
        <section id="journey" className="w-full">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Track Record</h2>
            <h3 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              My Creative Milestone Journey
            </h3>
          </div>

          {/* Timeline Line & Points */}
          <div className="relative border-l border-zinc-800 pl-8 ml-4 flex flex-col gap-12 text-left">
            {data.journey.map((j: any) => (
              <div key={j.id} className="relative">
                {/* Timeline Dot */}
                <div className={`absolute -left-[41px] top-1.5 h-6 w-6 rounded-full border-4 border-black shadow-md ${getJourneyDotColor(j.color)}`} />
                <div>
                  <span className="text-xs font-semibold tracking-wider text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 px-2 py-0.5 rounded uppercase">
                    {j.period}
                  </span>
                  <h4 className="mt-2 text-base font-bold text-white tracking-wide">
                    {j.title} {j.company && <span className="text-zinc-500 font-medium">@ {j.company}</span>}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {j.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ThreeDScrollWrapper>

      {/* 5. CONTACT SECTION */}
      <ThreeDScrollWrapper className="w-full max-w-4xl px-6 md:px-12">
        <section id="contact" className="w-full">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Get In Touch</h2>
            <h3 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Let's Engineer Visual Greatness
            </h3>
            <p className="mt-4 mx-auto max-w-md text-sm leading-relaxed text-zinc-500">
              Submit your creative requirements below to initiate a premium design partnership.
            </p>
          </div>

          {/* Contact Glassmorphic Form Card */}
          <div className="glass-panel rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-indigo-600/10 blur-3xl" />
            
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 mb-6">
                  <CheckCircle2 className="h-8 w-8 animate-bounce" />
                </div>
                <h4 className="text-lg font-bold text-white">Proposal Dispatched Successfully</h4>
                <p className="mt-2 text-sm text-zinc-400 max-w-sm">
                  Thank you. Your project scope has been loaded into my creative sandbox. I will review and reply within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 text-sm text-white placeholder-zinc-600 transition-all focus:border-indigo-500 focus:bg-zinc-950 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. john@brand.com"
                      className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-950/40 px-4 text-sm text-white placeholder-zinc-600 transition-all focus:border-indigo-500 focus:bg-zinc-950 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="project" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Project Description &amp; Scope
                  </label>
                  <textarea
                    id="project"
                    required
                    rows={5}
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                    placeholder="Outline your creative requirements, software preferences, and budget goals..."
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 text-sm text-white placeholder-zinc-600 transition-all focus:border-indigo-500 focus:bg-zinc-950 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-black font-semibold transition-all hover:bg-zinc-200 hover:shadow-xl hover:shadow-white/5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Dispatching..." : "Send Proposal Scope"}
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </section>
      </ThreeDScrollWrapper>

      {/* Floating Interactive Bottom Dock */}
      <FloatingDock items={navItems} />
    </main>
  );
}
