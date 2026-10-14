"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  key: string;
  name: string;
  cat: string;
  sub: string;
  desc: string;
  quote?: string;
  tags: string[];
  cover: string;
  lqip: string;
  gallery: string[];
  caps: string[];
  think?: {
    challenge?: string;
    idea?: string;
    mark?: string;
    craft?: string;
    type?: string;
    pal?: string[];
  };
}

interface HeroData {
  topLeft: string;
  topLeftDetail: string;
  line1: string;
  line2: string;
  studio: string;
  disciplines: string[];
  basedIn: string;
  volume: string;
}

interface AboutData {
  lead: string;
  paragraphs: string[];
  services: string[];
  basedList: string[];
  portraitTag: string;
}

interface ContactData {
  heading: string;
  email: string;
  instagramHandle: string;
  instagramUrl: string;
  phoneDisplay: string;
  phoneTel: string;
  location: string;
  timeChip: string;
  whatsapp: string;
  whatsappText: string;
  footerA: string;
  footerB: string;
}

interface SiteData {
  meta: { title: string; description: string };
  hero: HeroData;
  about: AboutData;
  contact: ContactData;
  projects: Project[];
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"projects" | "meta" | "hero" | "about" | "contact">("projects");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    const stored = sessionStorage.getItem("admin_auth");
    if (stored === "true") {
      setAuthenticated(true);
      fetchData();
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin", {
        headers: { Authorization: `Bearer ${password}` },
      });

      if (res.ok) {
        const jsonData = await res.json();
        setData(jsonData);
        setAuthenticated(true);
        sessionStorage.setItem("admin_auth", "true");
        sessionStorage.setItem("admin_password", password);
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  }

  async function fetchData() {
    const storedPass = sessionStorage.getItem("admin_password");
    if (!storedPass) return;

    try {
      const res = await fetch("/api/admin", {
        headers: { Authorization: `Bearer ${storedPass}` },
      });
      if (res.ok) {
        const jsonData = await res.json();
        setData(jsonData);
      }
    } catch {
      console.error("Failed to fetch data");
    }
  }

  async function saveProject(project: Project) {
    const storedPass = sessionStorage.getItem("admin_password");
    if (!storedPass || !data) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedPass}`,
        },
        body: JSON.stringify({
          action: "update_project",
          payload: { key: project.key, data: project },
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setData(result.data);
        setEditingProject(null);
        setShowAddForm(false);
      } else {
        setError("Failed to save project");
      }
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProject(key: string) {
    if (!confirm(`Delete project "${key}"? This cannot be undone.`)) return;

    const storedPass = sessionStorage.getItem("admin_password");
    if (!storedPass) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin?key=${key}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${storedPass}` },
      });

      if (res.ok) {
        fetchData();
      } else {
        setError("Failed to delete project");
      }
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  }

  async function updateSection(section: string, payload: Record<string, unknown>) {
    const storedPass = sessionStorage.getItem("admin_password");
    if (!storedPass) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedPass}`,
        },
        body: JSON.stringify({
          action: `update_${section}`,
          payload,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setData(result.data);
      } else {
        setError("Failed to update");
      }
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_auth");
    sessionStorage.removeItem("admin_password");
    setAuthenticated(false);
    setData(null);
    setPassword("");
  }

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8F5ED] to-[#E8E2D6] p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
        >
          <h1 className="font-serif text-3xl text-ink mb-2">Admin Panel</h1>
          <p className="text-ink-70 mb-6">Enter your password to manage the portfolio</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-paper py-3 rounded-lg font-semibold hover:bg-ink-soft transition-colors disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-[#F8F5ED]">
      {/* Header */}
      <header className="bg-white border-b border-line sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-serif text-2xl text-ink">Portfolio Admin</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm border border-line rounded-lg hover:bg-paper-lo transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-line">
          {(["projects", "meta", "hero", "about", "contact"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? "text-ink border-b-2 border-ink"
                  : "text-ink-50 hover:text-ink-70"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "projects" && (
            <motion.div
              key="projects"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl text-ink">Projects ({data?.projects.length || 0})</h2>
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setShowAddForm(true);
                  }}
                  className="px-4 py-2 bg-ink text-paper rounded-lg font-semibold hover:bg-ink-soft transition-colors"
                >
                  + Add Project
                </button>
              </div>

              <div className="grid gap-4">
                {data?.projects.map((project) => (
                  <div
                    key={project.key}
                    className="bg-white rounded-xl p-6 shadow-sm border border-line flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h3 className="font-serif text-xl text-ink mb-1">{project.name}</h3>
                      <p className="text-sm text-ink-70">{project.cat}</p>
                      <p className="text-xs text-ink-50 mt-1">{project.sub}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingProject(project);
                          setShowAddForm(false);
                        }}
                        className="px-3 py-1.5 text-sm border border-line rounded-lg hover:bg-paper-lo transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProject(project.key)}
                        className="px-3 py-1.5 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit/Add Form */}
              <AnimatePresence>
                {(editingProject || showAddForm) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
                  >
                    <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                      <h3 className="font-serif text-2xl text-ink mb-6">
                        {editingProject ? "Edit Project" : "Add New Project"}
                      </h3>

                      <ProjectForm
                        project={editingProject}
                        onSave={saveProject}
                        onCancel={() => {
                          setEditingProject(null);
                          setShowAddForm(false);
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {activeTab === "meta" && data && (
            <motion.div
              key="meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="font-serif text-2xl text-ink mb-6">Site Metadata</h2>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-line space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">Title</label>
                  <input
                    type="text"
                    defaultValue={data.meta.title}
                    onBlur={(e) => updateSection("meta", { title: e.target.value })}
                    className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">Description</label>
                  <textarea
                    defaultValue={data.meta.description}
                    onBlur={(e) => updateSection("meta", { description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "hero" && data && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="font-serif text-2xl text-ink mb-6">Hero Section</h2>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-line space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">Line 1</label>
                  <input
                    type="text"
                    defaultValue={data.hero.line1}
                    onBlur={(e) => updateSection("hero", { line1: e.target.value })}
                    className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">Line 2</label>
                  <input
                    type="text"
                    defaultValue={data.hero.line2}
                    onBlur={(e) => updateSection("hero", { line2: e.target.value })}
                    className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">Studio Name</label>
                  <input
                    type="text"
                    defaultValue={data.hero.studio}
                    onBlur={(e) => updateSection("hero", { studio: e.target.value })}
                    className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "about" && data && (
            <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="font-serif text-2xl text-ink mb-6">About Section</h2>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-line space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">Lead Text</label>
                  <textarea
                    defaultValue={data.about.lead}
                    onBlur={(e) => updateSection("about", { lead: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">Portrait Tag</label>
                  <input
                    type="text"
                    defaultValue={data.about.portraitTag}
                    onBlur={(e) => updateSection("about", { portraitTag: e.target.value })}
                    className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "contact" && data && (
            <motion.div
              key="contact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="font-serif text-2xl text-ink mb-6">Contact Section</h2>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-line space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={data.contact.email}
                    onBlur={(e) => updateSection("contact", { email: e.target.value })}
                    className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">Instagram Handle</label>
                  <input
                    type="text"
                    defaultValue={data.contact.instagramHandle}
                    onBlur={(e) => updateSection("contact", { instagramHandle: e.target.value })}
                    className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">Phone</label>
                  <input
                    type="text"
                    defaultValue={data.contact.phoneDisplay}
                    onBlur={(e) => updateSection("contact", { phoneDisplay: e.target.value })}
                    className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Project form component
function ProjectForm({
  project,
  onSave,
  onCancel,
}: {
  project: Project | null;
  onSave: (p: Project) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Project>(
    project || {
      key: "",
      name: "",
      cat: "",
      sub: "",
      desc: "",
      quote: "",
      tags: [],
      cover: "",
      lqip: "",
      gallery: [],
      caps: [],
      think: {},
    }
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-ink mb-2">Key (URL slug)</label>
          <input
            type="text"
            value={formData.key}
            onChange={(e) => setFormData({ ...formData, key: e.target.value })}
            className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            required
            disabled={!!project}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-ink mb-2">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-ink mb-2">Category</label>
          <input
            type="text"
            value={formData.cat}
            onChange={(e) => setFormData({ ...formData, cat: e.target.value })}
            className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-ink mb-2">Subtitle</label>
          <input
            type="text"
            value={formData.sub}
            onChange={(e) => setFormData({ ...formData, sub: e.target.value })}
            className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-ink mb-2">Description</label>
        <textarea
          value={formData.desc}
          onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-ink mb-2">Quote</label>
        <input
          type="text"
          value={formData.quote || ""}
          onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
          className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-ink mb-2">Cover Image Path</label>
        <input
          type="text"
          value={formData.cover}
          onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
          className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="/assets/img/project-cover.webp"
          required
        />
        {formData.cover && (
          <div className="mt-2 relative inline-block">
            <img
              src={formData.cover}
              alt="Cover preview"
              className="h-32 w-auto rounded-lg border border-line object-cover shadow-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">
              Cover
            </span>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-ink mb-2">Tags (comma-separated)</label>
        <input
          type="text"
          value={formData.tags.join(", ")}
          onChange={(e) =>
            setFormData({ ...formData, tags: e.target.value.split(",").map((t) => t.trim()) })
          }
          className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Gallery Images */}
      <div>
        <label className="block text-sm font-semibold text-ink mb-2">Gallery Images</label>
        <div className="space-y-2 mb-2">
          {formData.gallery.map((img, i) => (
            <div key={i} className="flex gap-2 items-start">
              {img && (
                <img
                  src={img}
                  alt={`Gallery ${i + 1}`}
                  className="h-16 w-16 rounded border border-line object-cover flex-shrink-0 mt-1"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              <input
                type="text"
                value={img}
                onChange={(e) => {
                  const next = [...formData.gallery];
                  next[i] = e.target.value;
                  setFormData({ ...formData, gallery: next });
                }}
                className="flex-1 px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                placeholder="/assets/img/project-gallery-1.webp"
              />
              <button
                type="button"
                onClick={() => {
                  const next = formData.gallery.filter((_, idx) => idx !== i);
                  setFormData({ ...formData, gallery: next });
                }}
                className="px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, gallery: [...formData.gallery, ""] })}
          className="px-4 py-2 text-sm border border-line rounded-lg hover:bg-paper-lo transition-colors"
        >
          + Add Gallery Image
        </button>
      </div>

      {/* Color Palette */}
      <div>
        <label className="block text-sm font-semibold text-ink mb-2">Color Palette (think.pal)</label>
        <div className="space-y-2 mb-2">
          {(formData.think?.pal || []).map((color, i) => (
            <div key={i} className="flex gap-2 items-center">
              <div
                className="w-8 h-8 rounded border border-line flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <input
                type="text"
                value={color}
                onChange={(e) => {
                  const nextPal = [...(formData.think?.pal || [])];
                  nextPal[i] = e.target.value;
                  setFormData({ ...formData, think: { ...formData.think, pal: nextPal } });
                }}
                className="flex-1 px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm font-mono"
                placeholder="#HEX or color name"
              />
              <button
                type="button"
                onClick={() => {
                  const nextPal = (formData.think?.pal || []).filter((_, idx) => idx !== i);
                  setFormData({ ...formData, think: { ...formData.think, pal: nextPal } });
                }}
                className="px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            const currentPal = formData.think?.pal || [];
            setFormData({ ...formData, think: { ...formData.think, pal: [...currentPal, "#"] } });
          }}
          className="px-4 py-2 text-sm border border-line rounded-lg hover:bg-paper-lo transition-colors"
        >
          + Add Color
        </button>
      </div>

      {/* Think Section Fields */}
      <div className="border-t border-line pt-4 mt-4">
        <h4 className="font-serif text-lg text-ink mb-4">Design Thinking</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Challenge</label>
            <textarea
              value={formData.think?.challenge || ""}
              onChange={(e) => setFormData({ ...formData, think: { ...formData.think, challenge: e.target.value } })}
              rows={2}
              className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Idea</label>
            <textarea
              value={formData.think?.idea || ""}
              onChange={(e) => setFormData({ ...formData, think: { ...formData.think, idea: e.target.value } })}
              rows={2}
              className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Mark</label>
            <input
              type="text"
              value={formData.think?.mark || ""}
              onChange={(e) => setFormData({ ...formData, think: { ...formData.think, mark: e.target.value } })}
              className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Craft</label>
            <input
              type="text"
              value={formData.think?.craft || ""}
              onChange={(e) => setFormData({ ...formData, think: { ...formData.think, craft: e.target.value } })}
              className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Type</label>
            <input
              type="text"
              value={formData.think?.type || ""}
              onChange={(e) => setFormData({ ...formData, think: { ...formData.think, type: e.target.value } })}
              className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-ink text-paper py-3 rounded-lg font-semibold hover:bg-ink-soft transition-colors"
        >
          Save Project
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-line rounded-lg font-semibold hover:bg-paper-lo transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}