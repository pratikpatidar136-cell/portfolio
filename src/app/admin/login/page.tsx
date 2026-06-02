"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, User, ShieldAlert, Key } from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Redirection on success
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "Invalid credentials. Try again.");
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center bg-black px-6 overflow-hidden">
      {/* Background spotlights */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#a855f7" />
      <div className="pointer-events-none absolute h-[300px] w-[300px] rounded-full bg-purple-500/10 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 w-full max-w-md"
      >
        {/* Title branding header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-xl shadow-indigo-500/10 mb-4">
            <Key className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">AETHER Command</h1>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">
            Secure Admin Gateway Portal
          </p>
        </div>

        {/* Glass panel login form */}
        <div className="glass-panel p-8 rounded-3xl relative overflow-hidden border border-zinc-800/40 bg-zinc-950/20 backdrop-blur-xl">
          <div className="pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full bg-indigo-500/5 blur-2xl" />

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs font-medium text-red-400"
            >
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Admin Username
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-zinc-600">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  id="username"
                  required
                  autoComplete="off"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Enter administrator ID..."
                  className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 pl-11 pr-4 text-sm text-white placeholder-zinc-700 transition-all focus:border-purple-500 focus:bg-zinc-950 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Security Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-zinc-600">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter security pass..."
                  className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-950/60 pl-11 pr-4 text-sm text-white placeholder-zinc-700 transition-all focus:border-purple-500 focus:bg-zinc-950 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-xl hover:shadow-purple-600/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Authenticating Session..." : "Establish Access Terminal"}
            </button>
          </form>
        </div>
      </motion.div>
    </main>
  );
}
