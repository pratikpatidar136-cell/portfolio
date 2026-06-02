"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  LayoutDashboard,
  Cpu,
  Layers,
  Calendar,
  Settings,
  Mail,
  Save,
  Plus,
  Trash2,
  Edit2,
  FolderOpen,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  Loader2
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [activeTab, setActiveTab] = useState("hero");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Portfolio local state mapping
  const [portfolioData, setPortfolioData] = useState<any>(null);
  // User proposals local state
  const [proposals, setProposals] = useState<any[]>([]);

  // CRUD Editing Modals/State
  const [activeServiceEdit, setActiveServiceEdit] = useState<any>(null); // For Services Add/Edit
  const [activeShowcaseEdit, setActiveShowcaseEdit] = useState<any>(null); // For Showcase Add/Edit
  const [activeJourneyEdit, setActiveJourneyEdit] = useState<any>(null); // For Journey Add/Edit
  const [newCategoryName, setNewCategoryName] = useState("");

  const triggerToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  // 1. Fetch Auth Session, Portfolio & Submissions
  useEffect(() => {
    const initDashboard = async () => {
      try {
        const authRes = await fetch("/api/admin/check-session");
        const authData = await authRes.json();
        
        if (!authData.authorized) {
          router.push("/admin/login");
          return;
        }

        setIsAuthChecking(false);

        // Fetch DB data
        const portRes = await fetch(`/api/portfolio?t=${Date.now()}`);
        const portData = await portRes.json();
        setPortfolioData(portData);

        const subRes = await fetch(`/api/admin/submissions?t=${Date.now()}`);
        const subData = await subRes.json();
        setProposals(Array.isArray(subData) ? subData : []);
      } catch (err) {
        console.error("Dashboard initialization error:", err);
        triggerToast("Failed to initialize dashboard parameters.", "error");
      }
    };

    initDashboard();
  }, [router]);

  // 2. Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (e) {
      triggerToast("Error ending security session.", "error");
    }
  };

  // 3. Save portfolio database changes to JSON
  const handleSavePortfolio = async (updatedData = portfolioData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        setPortfolioData(updatedData);
        triggerToast("Portfolio Database saved successfully!");
      } else {
        const errData = await res.json();
        triggerToast(errData.error || "Failed to update configuration database.", "error");
      }
    } catch (e) {
      triggerToast("Network error saving dynamic database payload.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Delete Proposal Message
  const handleDeleteProposal = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/submissions?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProposals(proposals.filter((p) => p.id !== id));
        triggerToast("Proposal deleted successfully.");
      } else {
        triggerToast("Failed to delete proposal message.", "error");
      }
    } catch (e) {
      triggerToast("Error communicating with mail routing endpoint.", "error");
    }
  };

  if (isAuthChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-indigo-400 flex-col gap-4 font-semibold uppercase tracking-wider text-xs">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span>Authorizing Command Terminal...</span>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-indigo-400 flex-col gap-4 font-semibold uppercase tracking-wider text-xs">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span>Buffering Portfolio Database...</span>
      </div>
    );
  }

  // Categories CRUD methods
  const addCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return;
    if (portfolioData.categories.includes(name)) {
      triggerToast("Category already exists.", "error");
      return;
    }
    const updated = {
      ...portfolioData,
      categories: [...portfolioData.categories, name],
    };
    handleSavePortfolio(updated);
    setNewCategoryName("");
  };

  const deleteCategory = (name: string) => {
    const updated = {
      ...portfolioData,
      categories: portfolioData.categories.filter((c: string) => c !== name),
      // Also filter showcase items that have this category, or default them
      showcase: portfolioData.showcase.map((s: any) => 
        s.category === name ? { ...s, category: portfolioData.categories[0] || "" } : s
      )
    };
    handleSavePortfolio(updated);
  };

  // Services CRUD methods
  const saveService = (e: React.FormEvent) => {
    e.preventDefault();
    const s = activeServiceEdit;
    let list = [...portfolioData.services];

    if (s.id.startsWith("new-")) {
      const newService = {
        id: `service-${Date.now()}`,
        title: s.title,
        description: s.description,
        icon: s.icon || "Video"
      };
      list.push(newService);
    } else {
      list = list.map((item) => (item.id === s.id ? s : item));
    }

    const updated = { ...portfolioData, services: list };
    handleSavePortfolio(updated);
    setActiveServiceEdit(null);
  };

  const deleteService = (id: string) => {
    const updated = {
      ...portfolioData,
      services: portfolioData.services.filter((s: any) => s.id !== id),
    };
    handleSavePortfolio(updated);
  };

  // Showcase CRUD methods
  const saveShowcase = (e: React.FormEvent) => {
    e.preventDefault();
    const item = activeShowcaseEdit;
    let list = [...portfolioData.showcase];

    // Format software string into array
    const softwareArr = typeof item.softwareStr === "string" 
      ? item.softwareStr.split(",").map((x: string) => x.trim()).filter(Boolean)
      : item.software || [];

    const itemToSave = {
      id: item.id.startsWith("new-") ? `showcase-${Date.now()}` : item.id,
      title: item.title,
      category: item.category || portfolioData.categories[0] || "",
      imageUrl: item.imageUrl || "/images/abstract_3d_geometry.png",
      duration: item.duration || "",
      client: item.client || "Self",
      software: softwareArr
    };

    if (item.id.startsWith("new-")) {
      list.push(itemToSave);
    } else {
      list = list.map((x) => (x.id === item.id ? itemToSave : x));
    }

    const updated = { ...portfolioData, showcase: list };
    handleSavePortfolio(updated);
    setActiveShowcaseEdit(null);
  };

  const deleteShowcase = (id: string) => {
    const updated = {
      ...portfolioData,
      showcase: portfolioData.showcase.filter((x: any) => x.id !== id),
    };
    handleSavePortfolio(updated);
  };

  // Journey CRUD methods
  const saveJourney = (e: React.FormEvent) => {
    e.preventDefault();
    const milestone = activeJourneyEdit;
    let list = [...portfolioData.journey];

    const milestoneToSave = {
      id: milestone.id.startsWith("new-") ? `journey-${Date.now()}` : milestone.id,
      period: milestone.period,
      title: milestone.title,
      company: milestone.company || "",
      description: milestone.description,
      color: milestone.color || "indigo"
    };

    if (milestone.id.startsWith("new-")) {
      list.push(milestoneToSave);
    } else {
      list = list.map((x) => (x.id === milestone.id ? milestoneToSave : x));
    }

    const updated = { ...portfolioData, journey: list };
    handleSavePortfolio(updated);
    setActiveJourneyEdit(null);
  };

  const deleteJourney = (id: string) => {
    const updated = {
      ...portfolioData,
      journey: portfolioData.journey.filter((x: any) => x.id !== id),
    };
    handleSavePortfolio(updated);
  };

  return (
    <div className="flex min-h-screen bg-[#030303] text-zinc-300 font-sans">
      
      {/* Toast popup */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 rounded-xl px-5 py-3 text-xs font-semibold tracking-wide shadow-2xl border ${
              toast.type === "success" 
                ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" 
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIDEBAR NAVIGATION CONTROLS */}
      <aside className="w-64 border-r border-zinc-900 bg-zinc-950/20 flex flex-col justify-between p-6">
        <div>
          {/* Logo Branding */}
          <div className="flex items-center gap-3 mb-10 pb-4 border-b border-zinc-900">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-sm">
              A
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wider">AETHER ADMIN</h2>
              <p className="text-[10px] text-zinc-600 uppercase font-semibold tracking-widest mt-0.5">Control Panel</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab("hero")}
              className={`flex items-center gap-3 h-10 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === "hero" ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Hero &amp; Stats</span>
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`flex items-center gap-3 h-10 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === "categories" ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <FolderOpen className="h-4 w-4" />
              <span>Categories</span>
            </button>

            <button
              onClick={() => setActiveTab("services")}
              className={`flex items-center gap-3 h-10 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === "services" ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Cpu className="h-4 w-4" />
              <span>Services</span>
            </button>

            <button
              onClick={() => setActiveTab("showcase")}
              className={`flex items-center gap-3 h-10 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === "showcase" ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Showcase Items</span>
            </button>

            <button
              onClick={() => setActiveTab("journey")}
              className={`flex items-center gap-3 h-10 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === "journey" ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Milestones</span>
            </button>

            <button
              onClick={() => setActiveTab("submissions")}
              className={`flex items-center gap-3 h-10 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors relative ${
                activeTab === "submissions" ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Mail className="h-4 w-4" />
              <span>User Proposals</span>
              {proposals.length > 0 && (
                <span className="absolute right-4 h-4 min-w-4 px-1 rounded-full bg-indigo-600 text-white text-[8px] flex items-center justify-center font-bold">
                  {proposals.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Action Footers */}
        <div className="flex flex-col gap-3">
          <a
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 h-10 rounded-xl border border-zinc-900 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/10"
          >
            <span>View Live Site</span>
            <ExternalLink className="h-3 w-3" />
          </a>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 h-10 rounded-xl bg-zinc-900 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>End Session</span>
          </button>
        </div>
      </aside>

      {/* DASHBOARD CONTENT BODY */}
      <main className="flex-1 p-10 flex flex-col justify-start max-w-5xl overflow-y-auto">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-900">
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide uppercase">
              {activeTab === "submissions" ? "Proposals Inbox" : `${activeTab} Management`}
            </h1>
            <p className="text-xs text-zinc-500 mt-1">Configure active layout arrays & parameters on the fly.</p>
          </div>

          {activeTab === "hero" && (
            <button
              onClick={() => handleSavePortfolio()}
              disabled={isLoading}
              className="flex items-center gap-2 h-10 px-5 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/10 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              <span>Commit Layout DB</span>
            </button>
          )}
        </header>

        {/* ----------------- TAB: HERO SECTION ----------------- */}
        {activeTab === "hero" && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6 rounded-2xl border border-zinc-900 bg-zinc-950/20 p-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Hero Main Title</label>
                <input
                  type="text"
                  value={portfolioData.hero.title}
                  onChange={(e) =>
                    setPortfolioData({
                      ...portfolioData,
                      hero: { ...portfolioData.hero, title: e.target.value },
                    })
                  }
                  className="h-12 w-full rounded-xl border border-zinc-900 bg-zinc-950 px-4 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Hero Description Paragraph</label>
                <textarea
                  value={portfolioData.hero.description}
                  rows={4}
                  onChange={(e) =>
                    setPortfolioData({
                      ...portfolioData,
                      hero: { ...portfolioData.hero, description: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-zinc-900 bg-zinc-950 p-4 text-sm text-white focus:border-indigo-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2 rounded-2xl border border-zinc-900 bg-zinc-950/20 p-5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Global Clients Stat</label>
                <input
                  type="text"
                  value={portfolioData.hero.globalClients}
                  onChange={(e) =>
                    setPortfolioData({
                      ...portfolioData,
                      hero: { ...portfolioData.hero, globalClients: e.target.value },
                    })
                  }
                  className="h-12 w-full rounded-xl border border-zinc-900 bg-zinc-950 px-4 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2 rounded-2xl border border-zinc-900 bg-zinc-950/20 p-5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Collective Views Stat</label>
                <input
                  type="text"
                  value={portfolioData.hero.collectiveViews}
                  onChange={(e) =>
                    setPortfolioData({
                      ...portfolioData,
                      hero: { ...portfolioData.hero, collectiveViews: e.target.value },
                    })
                  }
                  className="h-12 w-full rounded-xl border border-zinc-900 bg-zinc-950 px-4 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2 rounded-2xl border border-zinc-900 bg-zinc-950/20 p-5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Design Experience Stat</label>
                <input
                  type="text"
                  value={portfolioData.hero.experienceYears}
                  onChange={(e) =>
                    setPortfolioData({
                      ...portfolioData,
                      hero: { ...portfolioData.hero, experienceYears: e.target.value },
                    })
                  }
                  className="h-12 w-full rounded-xl border border-zinc-900 bg-zinc-950 px-4 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB: CATEGORIES ----------------- */}
        {activeTab === "categories" && (
          <div className="flex flex-col gap-6">
            <div className="flex gap-4 rounded-2xl border border-zinc-900 bg-zinc-950/20 p-5">
              <input
                type="text"
                placeholder="Enter new category name..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="h-12 flex-1 rounded-xl border border-zinc-900 bg-zinc-950 px-4 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
              <button
                onClick={addCategory}
                className="flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolioData.categories.map((cat: string) => (
                <div
                  key={cat}
                  className="flex items-center justify-between h-14 px-5 rounded-2xl border border-zinc-900 bg-zinc-950/10"
                >
                  <span className="text-sm font-semibold text-white tracking-wide">{cat}</span>
                  <button
                    onClick={() => deleteCategory(cat)}
                    className="p-2 text-zinc-600 hover:text-red-400 rounded-lg hover:bg-red-500/5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- TAB: SERVICES CRUD ----------------- */}
        {activeTab === "services" && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-end">
              <button
                onClick={() =>
                  setActiveServiceEdit({ id: "new-service", title: "", description: "", icon: "Video" })
                }
                className="flex items-center gap-2 h-10 px-5 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/10 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Create New Service</span>
              </button>
            </div>

            {/* List Services */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolioData.services.map((s: any) => (
                <div
                  key={s.id}
                  className="flex flex-col justify-between rounded-2xl border border-zinc-900 bg-zinc-950/20 p-6 min-h-[180px]"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/5 border border-indigo-500/10 px-2 py-0.5 rounded">
                        Icon: {s.icon}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setActiveServiceEdit(s)}
                          className="p-1.5 text-zinc-500 hover:text-indigo-400 rounded-lg hover:bg-indigo-500/5 cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => deleteService(s.id)}
                          className="p-1.5 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-red-500/5 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-white tracking-wide mt-3">{s.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-400">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit / Add Modal */}
            <AnimatePresence>
              {activeServiceEdit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-lg rounded-3xl border border-zinc-900 bg-[#070707] p-8 shadow-2xl"
                  >
                    <h2 className="text-base font-bold text-white mb-6 uppercase tracking-wider">
                      {activeServiceEdit.id.startsWith("new-") ? "Add Capability" : "Edit Capability"}
                    </h2>
                    <form onSubmit={saveService} className="flex flex-col gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Service Title</label>
                        <input
                          type="text"
                          required
                          value={activeServiceEdit.title}
                          onChange={(e) =>
                            setActiveServiceEdit({ ...activeServiceEdit, title: e.target.value })
                          }
                          className="h-12 w-full rounded-xl border border-zinc-900 bg-zinc-950 px-4 text-sm text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Lucide Icon Name</label>
                        <select
                          value={activeServiceEdit.icon}
                          onChange={(e) =>
                            setActiveServiceEdit({ ...activeServiceEdit, icon: e.target.value })
                          }
                          className="h-12 w-full rounded-xl border border-zinc-900 bg-zinc-950 px-4 text-sm text-white focus:border-indigo-500 focus:outline-none"
                        >
                          <option value="Video">Video</option>
                          <option value="Sparkles">Sparkles</option>
                          <option value="Palette">Palette</option>
                          <option value="Layers">Layers</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Description Paragraph</label>
                        <textarea
                          required
                          rows={4}
                          value={activeServiceEdit.description}
                          onChange={(e) =>
                            setActiveServiceEdit({ ...activeServiceEdit, description: e.target.value })
                          }
                          className="w-full rounded-xl border border-zinc-900 bg-zinc-950 p-4 text-sm text-white focus:border-indigo-500 focus:outline-none resize-none"
                        />
                      </div>

                      <div className="flex gap-4 mt-2">
                        <button
                          type="button"
                          onClick={() => setActiveServiceEdit(null)}
                          className="flex-1 h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-zinc-400 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white cursor-pointer"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ----------------- TAB: SHOWCASE CRUD ----------------- */}
        {activeTab === "showcase" && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-end">
              <button
                onClick={() =>
                  setActiveShowcaseEdit({
                    id: "new-item",
                    title: "",
                    category: portfolioData.categories[0] || "",
                    imageUrl: "",
                    duration: "",
                    client: "",
                    softwareStr: ""
                  })
                }
                className="flex items-center gap-2 h-10 px-5 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/10 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Showcase Piece</span>
              </button>
            </div>

            {/* List Showcase */}
            <div className="flex flex-col gap-4">
              {portfolioData.showcase.map((item: any) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row md:items-center justify-between rounded-2xl border border-zinc-900 bg-zinc-950/10 p-5 gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-20 rounded-lg overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl || "/images/abstract_3d_geometry.png"}
                        alt={item.title}
                        className="object-cover h-full w-full"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">
                          {item.category}
                        </span>
                        <span className="text-[9px] text-zinc-500">•</span>
                        <span className="text-[9px] text-zinc-400">Client: {item.client}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-white tracking-wide mt-1">{item.title}</h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs text-zinc-500 font-mono">{item.duration || "N/A"}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setActiveShowcaseEdit({
                            ...item,
                            softwareStr: Array.isArray(item.software) ? item.software.join(", ") : ""
                          })
                        }
                        className="p-2 text-zinc-500 hover:text-indigo-400 rounded-lg hover:bg-indigo-500/5 cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteShowcase(item.id)}
                        className="p-2 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-red-500/5 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add / Edit Modal */}
            <AnimatePresence>
              {activeShowcaseEdit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-lg rounded-3xl border border-zinc-900 bg-[#070707] p-8 shadow-2xl"
                  >
                    <h2 className="text-base font-bold text-white mb-6 uppercase tracking-wider">
                      {activeShowcaseEdit.id.startsWith("new-") ? "Add Portfolio Piece" : "Edit Portfolio Piece"}
                    </h2>
                    <form onSubmit={saveShowcase} className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Piece Title</label>
                        <input
                          type="text"
                          required
                          value={activeShowcaseEdit.title}
                          onChange={(e) =>
                            setActiveShowcaseEdit({ ...activeShowcaseEdit, title: e.target.value })
                          }
                          className="h-12 w-full rounded-xl border border-zinc-900 bg-zinc-950 px-4 text-sm text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Category Tag</label>
                          <select
                            value={activeShowcaseEdit.category}
                            onChange={(e) =>
                              setActiveShowcaseEdit({ ...activeShowcaseEdit, category: e.target.value })
                            }
                            className="h-12 w-full rounded-xl border border-zinc-900 bg-zinc-950 px-4 text-sm text-white focus:border-indigo-500 focus:outline-none"
                          >
                            {portfolioData.categories.map((c: string) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Duration (e.g. 1:45)</label>
                          <input
                            type="text"
                            value={activeShowcaseEdit.duration}
                            onChange={(e) =>
                              setActiveShowcaseEdit({ ...activeShowcaseEdit, duration: e.target.value })
                            }
                            className="h-12 w-full rounded-xl border border-zinc-900 bg-zinc-950 px-4 text-sm text-white focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Client / Studio</label>
                          <input
                            type="text"
                            value={activeShowcaseEdit.client}
                            onChange={(e) =>
                              setActiveShowcaseEdit({ ...activeShowcaseEdit, client: e.target.value })
                            }
                            className="h-12 w-full rounded-xl border border-zinc-900 bg-zinc-950 px-4 text-sm text-white focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Thumbnail Image Path</label>
                          <select
                            value={activeShowcaseEdit.imageUrl}
                            onChange={(e) =>
                              setActiveShowcaseEdit({ ...activeShowcaseEdit, imageUrl: e.target.value })
                            }
                            className="h-12 w-full rounded-xl border border-zinc-900 bg-zinc-950 px-4 text-sm text-white focus:border-indigo-500 focus:outline-none"
                          >
                            <option value="">-- Choose generated image --</option>
                            <option value="/images/cinematic_video_editor.png">Cinematic Video Editor</option>
                            <option value="/images/abstract_3d_geometry.png">Abstract 3D Chrome</option>
                            <option value="/images/vfx_cosmic_portal.png">VFX Nebula Portal</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                          Software Utilities Used (Comma separated)
                        </label>
                        <input
                          type="text"
                          placeholder="Premiere Pro, DaVinci Resolve, Nuke"
                          value={activeShowcaseEdit.softwareStr}
                          onChange={(e) =>
                            setActiveShowcaseEdit({ ...activeShowcaseEdit, softwareStr: e.target.value })
                          }
                          className="h-12 w-full rounded-xl border border-zinc-900 bg-zinc-950 px-4 text-sm text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>

                      <div className="flex gap-4 mt-2">
                        <button
                          type="button"
                          onClick={() => setActiveShowcaseEdit(null)}
                          className="flex-1 h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-zinc-400 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white cursor-pointer"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ----------------- TAB: JOURNEY TIMELINE CRUD ----------------- */}
        {activeTab === "journey" && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-end">
              <button
                onClick={() =>
                  setActiveJourneyEdit({
                    id: "new-milestone",
                    period: "",
                    title: "",
                    company: "",
                    description: "",
                    color: "indigo"
                  })
                }
                className="flex items-center gap-2 h-10 px-5 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/10 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Milestone</span>
              </button>
            </div>

            {/* List Journey */}
            <div className="flex flex-col gap-4">
              {portfolioData.journey.map((m: any) => (
                <div
                  key={m.id}
                  className="flex justify-between items-start rounded-2xl border border-zinc-900 bg-zinc-950/10 p-5"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10">
                        {m.period}
                      </span>
                      {m.company && (
                        <span className="text-xs text-zinc-500">
                          @{m.company}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white tracking-wide mt-2">{m.title}</h4>
                    <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed max-w-2xl">{m.description}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveJourneyEdit(m)}
                      className="p-2 text-zinc-500 hover:text-indigo-400 rounded-lg hover:bg-indigo-500/5 cursor-pointer"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteJourney(m.id)}
                      className="p-2 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-red-500/5 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit / Add Modal */}
            <AnimatePresence>
              {activeJourneyEdit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-lg rounded-3xl border border-zinc-900 bg-[#070707] p-8 shadow-2xl"
                  >
                    <h2 className="text-base font-bold text-white mb-6 uppercase tracking-wider">
                      {activeJourneyEdit.id.startsWith("new-") ? "Add Experience" : "Edit Experience"}
                    </h2>
                    <form onSubmit={saveJourney} className="flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Period Year Range</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 2024 - PRESENT"
                            value={activeJourneyEdit.period}
                            onChange={(e) =>
                              setActiveJourneyEdit({ ...activeJourneyEdit, period: e.target.value })
                            }
                            className="h-12 w-full rounded-xl border border-zinc-900 bg-zinc-950 px-4 text-sm text-white focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Timeline Dot Color</label>
                          <select
                            value={activeJourneyEdit.color}
                            onChange={(e) =>
                              setActiveJourneyEdit({ ...activeJourneyEdit, color: e.target.value })
                            }
                            className="h-12 w-full rounded-xl border border-zinc-900 bg-zinc-950 px-4 text-sm text-white focus:border-indigo-500 focus:outline-none"
                          >
                            <option value="indigo">Indigo glow</option>
                            <option value="purple">Purple glow</option>
                            <option value="zinc">Muted Zinc</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Milestone Title</label>
                          <input
                            type="text"
                            required
                            value={activeJourneyEdit.title}
                            onChange={(e) =>
                              setActiveJourneyEdit({ ...activeJourneyEdit, title: e.target.value })
                            }
                            className="h-12 w-full rounded-xl border border-zinc-900 bg-zinc-950 px-4 text-sm text-white focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Company (Optional)</label>
                          <input
                            type="text"
                            value={activeJourneyEdit.company}
                            onChange={(e) =>
                              setActiveJourneyEdit({ ...activeJourneyEdit, company: e.target.value })
                            }
                            className="h-12 w-full rounded-xl border border-zinc-900 bg-zinc-950 px-4 text-sm text-white focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Role / Milestone details</label>
                        <textarea
                          required
                          rows={4}
                          value={activeJourneyEdit.description}
                          onChange={(e) =>
                            setActiveJourneyEdit({ ...activeJourneyEdit, description: e.target.value })
                          }
                          className="w-full rounded-xl border border-zinc-900 bg-zinc-950 p-4 text-sm text-white focus:border-indigo-500 focus:outline-none resize-none"
                        />
                      </div>

                      <div className="flex gap-4 mt-2">
                        <button
                          type="button"
                          onClick={() => setActiveJourneyEdit(null)}
                          className="flex-1 h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-zinc-400 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white cursor-pointer"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ----------------- TAB: PROPOSALS INBOX ----------------- */}
        {activeTab === "submissions" && (
          <div className="flex flex-col gap-6">
            {proposals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-zinc-900 bg-zinc-950/5">
                <span className="text-4xl mb-4">📬</span>
                <h4 className="text-sm font-semibold text-zinc-400">Inbox is empty.</h4>
                <p className="text-xs text-zinc-600 max-w-xs mt-2 leading-relaxed">
                  Incoming contact proposals submitted through your landing page will appear here.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {proposals.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-2xl border border-zinc-900 bg-zinc-950/20 p-6 relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-white">{p.name}</h4>
                        <a
                          href={`mailto:${p.email}`}
                          className="text-xs text-indigo-400 hover:underline mt-1 inline-block"
                        >
                          {p.email}
                        </a>
                      </div>
                      <button
                        onClick={() => handleDeleteProposal(p.id)}
                        className="p-2 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-red-500/5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-zinc-900 flex flex-col gap-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Project Requirements</span>
                      <p className="text-xs leading-relaxed text-zinc-300 mt-1 whitespace-pre-wrap">
                        {p.project}
                      </p>
                    </div>

                    <span className="absolute bottom-6 right-6 text-[9px] font-mono text-zinc-600">
                      {new Date(p.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
