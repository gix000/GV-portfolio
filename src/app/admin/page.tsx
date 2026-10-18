"use client";
import { useState, useEffect, useMemo } from "react";
import type { SiteData, Project, VideoProject } from "@/lib/data";
import { ImageField } from "./ImageField";
import { Field, TextInput, ListInput, SmallBtn, moveItem, inputCls } from "./fields";

/* ------------------------------------------------------------------ */
/* Schema: every editable text on the site, grouped by tab            */
/* ------------------------------------------------------------------ */

type FieldType = "text" | "textarea" | "html" | "list" | "listLong" | "image";
type FieldDef = { path: string; label: string; type?: FieldType; hint?: string; aspect?: number };
type Group = { title: string; fields: FieldDef[] };

const HTML_HINT = "Wrap words in <em>…</em> for italic. Use <br> for a line break.";

const TEXT_TABS: { id: string; label: string; groups: Group[] }[] = [
  {
    id: "hero",
    label: "Header & Hero",
    groups: [
      {
        title: "Header",
        fields: [
          { path: "ui.nav.uiuxButton", label: "UI/UX button" },
          { path: "ui.intro.tapToEnter", label: "Intro screen: “Tap to Enter”" },
        ],
      },
      {
        title: "Hero",
        fields: [
          { path: "ui.hero.tagline", label: "Tagline (italic, above the title)" },
          { path: "hero.line1", label: "Big title, line 1" },
          { path: "hero.line2", label: "Big title, line 2 (italic)" },
          { path: "ui.hero.volumeChip", label: "Top-right chip" },
          { path: "ui.hero.studioLabel", label: "Label 1" },
          { path: "hero.studio", label: "Value 1" },
          { path: "ui.hero.disciplineLabel", label: "Label 2" },
          { path: "ui.hero.discipline", label: "Value 2" },
          { path: "ui.hero.basedInLabel", label: "Label 3" },
          { path: "hero.basedIn", label: "Value 3" },
          { path: "ui.hero.volumeLabel", label: "Label 4" },
          { path: "hero.volume", label: "Value 4" },
          { path: "ui.hero.scroll", label: "Scroll cue" },
        ],
      },
    ],
  },
  {
    id: "about",
    label: "About",
    groups: [
      {
        title: "Section header",
        fields: [
          { path: "ui.about.number", label: "Number" },
          { path: "ui.about.kicker", label: "Title" },
          { path: "ui.about.kickerRight", label: "Right label" },
        ],
      },
      {
        title: "Portrait",
        fields: [
          { path: "ui.about.portrait", label: "Portrait photo", type: "image", aspect: 3 / 4 },
          { path: "about.portraitTag", label: "Caption under the photo" },
        ],
      },
      {
        title: "Text",
        fields: [
          { path: "about.lead", label: "Intro (large text)", type: "html", hint: HTML_HINT },
          { path: "about.paragraphs", label: "Paragraphs", type: "listLong" },
          { path: "ui.about.servicesLabel", label: "Services heading" },
          { path: "about.services", label: "Services", type: "list" },
          { path: "ui.about.basedLabel", label: "Second list heading" },
          { path: "about.basedList", label: "Second list", type: "list" },
        ],
      },
    ],
  },
  {
    id: "works",
    label: "Works",
    groups: [
      {
        title: "Section header",
        fields: [
          { path: "ui.works.number", label: "Number" },
          { path: "ui.works.kicker", label: "Title" },
          { path: "ui.works.kickerRight", label: "Right label" },
          { path: "works.title", label: "Heading", type: "html", hint: HTML_HINT },
          { path: "works.sub", label: "Intro text", type: "textarea" },
        ],
      },
      {
        title: "Carousel",
        fields: [
          { path: "ui.works.swipeHint", label: "Swipe hint" },
          { path: "ui.works.countLabel", label: "Count label (after the number)" },
          { path: "ui.works.imagesLabel", label: "Image count label on cards" },
        ],
      },
    ],
  },
  {
    id: "contact",
    label: "Contact & Footer",
    groups: [
      {
        title: "Section header",
        fields: [
          { path: "ui.contact.number", label: "Number" },
          { path: "ui.contact.kicker", label: "Title" },
          { path: "ui.contact.kickerRight", label: "Right label" },
          { path: "contact.heading", label: "Heading", type: "html", hint: HTML_HINT },
        ],
      },
      {
        title: "Details",
        fields: [
          { path: "contact.email", label: "Email" },
          { path: "ui.contact.igLabel", label: "Instagram label" },
          { path: "contact.instagramHandle", label: "Instagram handle" },
          { path: "contact.instagramUrl", label: "Instagram link" },
          { path: "ui.contact.telLabel", label: "Phone label" },
          { path: "contact.phoneDisplay", label: "Phone (as shown)" },
          { path: "contact.phoneTel", label: "Phone (for tap-to-call)", hint: "Digits with country code, e.g. +96179106883" },
          { path: "contact.whatsapp", label: "WhatsApp number", hint: "Digits only, e.g. 96179106883" },
          { path: "contact.whatsappText", label: "WhatsApp pre-filled message", type: "textarea" },
        ],
      },
      {
        title: "Footer",
        fields: [
          { path: "contact.footerA", label: "Footer left (after ©year)" },
          { path: "contact.footerB", label: "Footer right" },
        ],
      },
    ],
  },
  {
    id: "case",
    label: "Project pages",
    groups: [
      {
        title: "Labels on every project page",
        fields: [
          { path: "ui.caseStudy.back", label: "Back button" },
          { path: "ui.caseStudy.viewGallery", label: "“View gallery” chip" },
          { path: "ui.caseStudy.closeGallery", label: "Close gallery button" },
          { path: "ui.caseStudy.palette", label: "Palette heading" },
          { path: "ui.caseStudy.process", label: "Design thinking heading" },
          { path: "ui.caseStudy.challenge", label: "Label: challenge" },
          { path: "ui.caseStudy.idea", label: "Label: idea" },
          { path: "ui.caseStudy.mark", label: "Label: mark" },
          { path: "ui.caseStudy.craft", label: "Label: craft" },
          { path: "ui.caseStudy.type", label: "Label: typography" },
          { path: "ui.caseStudy.notFoundTitle", label: "Not-found title" },
          { path: "ui.caseStudy.notFoundText", label: "Not-found text", type: "textarea" },
          { path: "ui.caseStudy.notFoundButton", label: "Not-found button" },
        ],
      },
    ],
  },
  {
    id: "uiuxpage",
    label: "UI/UX page",
    groups: [
      {
        title: "Page text",
        fields: [
          { path: "ui.uiux.back", label: "Back button" },
          { path: "ui.uiux.topRight", label: "Top-right label" },
          { path: "ui.uiux.number", label: "Number" },
          { path: "ui.uiux.kicker", label: "Section title" },
          { path: "ui.uiux.title", label: "Heading" },
          { path: "ui.uiux.intro", label: "Intro text", type: "textarea" },
          { path: "ui.uiux.tapToTry", label: "“Tap to try” chip" },
          { path: "ui.uiux.tryButton", label: "“Try it” button" },
          { path: "ui.uiux.swipeHint", label: "Swipe hint" },
          { path: "ui.uiux.countLabel", label: "Count label" },
          { path: "ui.uiux.viewerSubtitle", label: "Prototype viewer subtitle" },
          { path: "ui.uiux.watchFilm", label: "“Watch film” button" },
        ],
      },
    ],
  },
  {
    id: "seo",
    label: "SEO",
    groups: [
      {
        title: "Google & link previews",
        fields: [
          { path: "meta.title", label: "Browser tab / Google title" },
          { path: "meta.description", label: "Google description", type: "textarea" },
        ],
      },
    ],
  },
];

const TRACKED: (keyof SiteData)[] = ["meta", "hero", "about", "works", "contact", "ui", "uiuxVideos"];

/* ------------------------------------------------------------------ */
/* Path helpers                                                        */
/* ------------------------------------------------------------------ */

type Obj = Record<string, unknown>;
function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Obj)[k] : undefined), obj);
}
function setPath<T>(obj: T, path: string, value: unknown): T {
  const [k, ...rest] = path.split(".");
  const cur = (obj as Obj) ?? {};
  return { ...cur, [k]: rest.length ? setPath(cur[k] as Obj, rest.join("."), value) : value } as T;
}

function authHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${sessionStorage.getItem("admin_password") || ""}`,
  };
}

async function postAction(action: string, payload: unknown): Promise<SiteData> {
  const res = await fetch("/api/admin", { method: "POST", headers: authHeaders(), body: JSON.stringify({ action, payload }) });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
  return json.data as SiteData;
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

type Tab = string;

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState<SiteData | null>(null);
  const [draft, setDraft] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [tab, setTab] = useState<Tab>("projects");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  function flash(msg: string) {
    setNotice(msg);
    setTimeout(() => setNotice(""), 2500);
  }

  function applyServer(next: SiteData) {
    setData(next);
    setDraft(next);
  }

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "true") {
      setAuthenticated(true);
      fetchData();
    }
  }, []);

  const dirtyKeys = useMemo(
    () => (data && draft ? TRACKED.filter((k) => JSON.stringify(data[k]) !== JSON.stringify(draft[k])) : []),
    [data, draft],
  );

  // Warn before closing the tab with unsaved edits.
  useEffect(() => {
    if (!dirtyKeys.length) return;
    const h = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirtyKeys.length]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin", { headers: { Authorization: `Bearer ${password}` } });
      if (res.ok) {
        applyServer(await res.json());
        setAuthenticated(true);
        sessionStorage.setItem("admin_auth", "true");
        sessionStorage.setItem("admin_password", password);
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData?.error || `Invalid password or unauthorized (${res.status})`);
      }
    } catch (e) {
      setError(`Connection error: ${String(e)}`);
    } finally {
      setLoading(false);
    }
  }

  async function fetchData() {
    try {
      const res = await fetch("/api/admin", { headers: authHeaders() });
      const json = await res.json().catch(() => ({}));
      if (res.ok) applyServer(json);
      else setError(json?.error || `Failed to load data (${res.status})`);
    } catch (e) {
      setError(`Connection error: ${String(e)}`);
    }
  }

  async function saveDraft() {
    if (!draft || !dirtyKeys.length) return;
    setSaving(true);
    setError("");
    try {
      let latest: SiteData | null = null;
      for (const key of dirtyKeys) {
        latest = await postAction("set_section", { section: key, value: draft[key] });
      }
      if (latest) applyServer(latest);
      flash("Saved — live on the site");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  async function saveProject(project: Project, isNew: boolean) {
    if (!data) return;
    const key = project.key.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    if (!key) return setError("Key is required (letters or numbers).");
    if (isNew && data.projects.some((p) => p.key === key)) {
      return setError(`A project with the key "${key}" already exists. Pick another key.`);
    }
    const clean: Project = { ...project, key, tags: project.tags.map((t) => t.trim()).filter(Boolean) };
    setSaving(true);
    setError("");
    try {
      const next = await postAction("update_project", { key, data: clean });
      // Keep any unsaved text edits in other tabs.
      setData(next);
      setDraft((d) => (d ? { ...d, projects: next.projects } : next));
      setEditingProject(null);
      setShowAddForm(false);
      flash(isNew ? "Project added" : "Project saved");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  async function deleteProject(key: string) {
    if (!confirm(`Delete project "${key}"? This cannot be undone.`)) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin?key=${encodeURIComponent(key)}`, { method: "DELETE", headers: authHeaders() });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || `Failed to delete project (${res.status})`);
      setData((d) => (d ? { ...d, projects: d.projects.filter((p) => p.key !== key) } : d));
      setDraft((d) => (d ? { ...d, projects: d.projects.filter((p) => p.key !== key) } : d));
      flash("Project deleted");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  async function moveProject(from: number, to: number) {
    if (!data) return;
    const projects = moveItem(data.projects, from, to);
    if (projects === data.projects) return;
    setSaving(true);
    try {
      const next = await postAction("set_section", { section: "projects", value: projects });
      setData(next);
      setDraft((d) => (d ? { ...d, projects: next.projects } : next));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_auth");
    sessionStorage.removeItem("admin_password");
    setAuthenticated(false);
    setData(null);
    setDraft(null);
    setPassword("");
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAF3DE] to-[#EDE0BE] p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <h1 className="font-serif text-3xl text-ink mb-2">Admin Panel</h1>
          <p className="text-ink-70 mb-6">Enter your password to manage the portfolio</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={inputCls}
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
        </div>
      </div>
    );
  }

  const textTab = TEXT_TABS.find((t) => t.id === tab);
  const allTabs: { id: Tab; label: string }[] = [
    { id: "projects", label: "Projects" },
    { id: "uiux", label: "UI/UX concepts" },
    ...TEXT_TABS.map((t) => ({ id: t.id, label: t.label })),
  ];

  return (
    <div className="min-h-screen bg-[#FAF3DE] pb-28">
      <header className="bg-white border-b border-line sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <h1 className="font-serif text-xl sm:text-2xl text-ink">Portfolio Admin</h1>
          <div className="flex gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer" className="px-3 py-2 text-sm border border-line rounded-lg hover:bg-paper-lo">
              View site
            </a>
            <button onClick={handleLogout} className="px-3 py-2 text-sm border border-line rounded-lg hover:bg-paper-lo">
              Logout
            </button>
          </div>
        </div>
        <nav className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto [scrollbar-width:none]">
          {allTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 px-3.5 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                tab === t.id ? "text-ink border-ink" : "text-ink-50 border-transparent hover:text-ink-70"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-red-800 mb-1">Something went wrong</p>
              <p className="text-sm text-red-700 break-words">{error}</p>
            </div>
            <button onClick={() => setError("")} className="text-red-500 hover:text-red-700 text-lg leading-none" aria-label="Dismiss error">
              ✕
            </button>
          </div>
        )}

        {!draft && !error && <p className="text-ink-50">Loading…</p>}

        {draft && tab === "projects" && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-serif text-2xl text-ink">Projects ({draft.projects.length})</h2>
              <button
                onClick={() => {
                  setEditingProject(null);
                  setShowAddForm(true);
                }}
                className="px-4 py-2 bg-ink text-paper rounded-lg font-semibold hover:bg-ink-soft"
              >
                + Add Project
              </button>
            </div>
            <p className="text-sm text-ink-50 mb-4">Use the arrows to change the order on the homepage.</p>
            <div className="grid gap-3">
              {draft.projects.map((project, i) => (
                <div key={project.key} className="bg-white rounded-xl p-3 sm:p-4 border border-line flex items-center gap-3">
                  <div className="w-20 h-14 sm:w-24 sm:h-16 rounded-lg overflow-hidden bg-paper-lo shrink-0">
                    {project.cover && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={project.cover} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-lg text-ink truncate">{project.name}</h3>
                    <p className="text-xs text-ink-50 truncate">{project.cat}</p>
                  </div>
                  <div className="flex flex-wrap justify-end gap-1.5">
                    <SmallBtn title="Move up" disabled={i === 0 || saving} onClick={() => moveProject(i, i - 1)}>↑</SmallBtn>
                    <SmallBtn title="Move down" disabled={i === draft.projects.length - 1 || saving} onClick={() => moveProject(i, i + 1)}>↓</SmallBtn>
                    <SmallBtn
                      onClick={() => {
                        setEditingProject(project);
                        setShowAddForm(false);
                      }}
                    >
                      Edit
                    </SmallBtn>
                    <SmallBtn danger disabled={saving} onClick={() => deleteProject(project.key)}>Delete</SmallBtn>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {draft && tab === "uiux" && (
          <UiuxEditor value={draft.uiuxVideos} onChange={(v) => setDraft({ ...draft, uiuxVideos: v })} />
        )}

        {draft && textTab && (
          <section className="space-y-6">
            {textTab.groups.map((g) => (
              <div key={g.title} className="bg-white rounded-xl p-4 sm:p-6 border border-line">
                <h3 className="font-serif text-xl text-ink mb-4">{g.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {g.fields.map((f) => {
                    const wide = f.type && f.type !== "text";
                    const val = getPath(draft, f.path);
                    const set = (v: unknown) => setDraft((d) => (d ? setPath(d, f.path, v) : d));
                    return (
                      <div key={f.path} className={wide ? "md:col-span-2" : ""}>
                        {f.type === "image" ? (
                          <ImageField label={f.label} value={String(val ?? "")} onChange={set} aspect={f.aspect ?? null} />
                        ) : (
                          <Field label={f.label} hint={f.hint}>
                            {f.type === "list" || f.type === "listLong" ? (
                              <ListInput
                                value={Array.isArray(val) ? (val as string[]) : []}
                                onChange={set}
                                multiline={f.type === "listLong"}
                              />
                            ) : (
                              <TextInput
                                value={String(val ?? "")}
                                onChange={set}
                                multiline={f.type === "textarea" || f.type === "html"}
                              />
                            )}
                          </Field>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>
        )}
      </main>

      {/* Save bar for all text / UI-UX edits */}
      {dirtyKeys.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-line shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
            <span className="text-sm text-ink-70">Unsaved changes</span>
            <div className="flex gap-2">
              <button
                onClick={() => data && setDraft(data)}
                disabled={saving}
                className="px-4 py-2.5 text-sm border border-line rounded-lg hover:bg-paper-lo disabled:opacity-50"
              >
                Discard
              </button>
              <button
                onClick={saveDraft}
                disabled={saving}
                className="px-5 py-2.5 text-sm bg-ink text-paper rounded-lg font-semibold hover:bg-ink-soft disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {notice && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-full bg-ink text-paper text-sm font-semibold shadow-lg">
          {notice}
        </div>
      )}

      {(editingProject || showAddForm) && (
        <div className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center p-0 sm:p-4 z-50" data-lenis-prevent>
          <div className="bg-white sm:rounded-2xl p-5 sm:p-8 max-w-3xl w-full h-full sm:h-auto sm:max-h-[92vh] overflow-y-auto overscroll-contain">
            <h3 className="font-serif text-2xl text-ink mb-6">{editingProject ? "Edit Project" : "Add New Project"}</h3>
            <ProjectForm
              key={editingProject?.key ?? "new"}
              project={editingProject}
              saving={saving}
              onSave={(p) => saveProject(p, !editingProject)}
              onCancel={() => {
                setEditingProject(null);
                setShowAddForm(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Project form                                                        */
/* ------------------------------------------------------------------ */

function ProjectForm({
  project,
  saving,
  onSave,
  onCancel,
}: {
  project: Project | null;
  saving: boolean;
  onSave: (p: Project) => void;
  onCancel: () => void;
}) {
  const [f, setF] = useState<Project>(() => ({
    key: "",
    name: "",
    cat: "",
    sub: "",
    desc: "",
    quote: "",
    lqip: "",
    cover: "",
    ...project,
    tags: project?.tags ?? [],
    gallery: project?.gallery ?? [],
    caps: project?.caps ?? [],
    think: project?.think ?? {},
  }));
  const [tagsText, setTagsText] = useState((project?.tags ?? []).join(", "));
  const set = <K extends keyof Project>(k: K, v: Project[K]) => setF((p) => ({ ...p, [k]: v }));
  const setThink = (k: string, v: unknown) => setF((p) => ({ ...p, think: { ...p.think, [k]: v } }));

  // Gallery images and their captions move together.
  const slots = f.gallery.map((img, i) => ({ img, cap: f.caps[i] ?? "" }));
  const setSlots = (next: { img: string; cap: string }[]) =>
    setF((p) => ({ ...p, gallery: next.map((s) => s.img), caps: next.map((s) => s.cap) }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const keep = slots.filter((s) => s.img);
    onSave({
      ...f,
      tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean),
      gallery: keep.map((s) => s.img),
      caps: keep.map((s) => s.cap),
    });
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Key (URL slug)" hint={project ? "Can't be changed after creation." : "e.g. balcony-burgers"}>
          <input
            type="text"
            value={f.key}
            onChange={(e) => set("key", e.target.value)}
            className={`${inputCls} disabled:opacity-60`}
            required
            disabled={!!project}
          />
        </Field>
        <Field label="Name">
          <input type="text" value={f.name} onChange={(e) => set("name", e.target.value)} className={inputCls} required />
        </Field>
        <Field label="Category" hint="Shown on the card, e.g. Brand Identity · Social">
          <input type="text" value={f.cat} onChange={(e) => set("cat", e.target.value)} className={inputCls} required />
        </Field>
        <Field label="Subtitle">
          <input type="text" value={f.sub} onChange={(e) => set("sub", e.target.value)} className={inputCls} />
        </Field>
      </div>

      <Field label="Description">
        <TextInput value={f.desc} onChange={(v) => set("desc", v)} multiline rows={4} />
      </Field>
      <Field label="Quote" hint="Shown on the homepage card and as a pull-quote.">
        <TextInput value={f.quote || ""} onChange={(v) => set("quote", v)} />
      </Field>

      <ImageField label="Cover image" value={f.cover} onChange={(url) => set("cover", url)} aspect={16 / 10} />

      <Field label="Tags (comma-separated)">
        <input type="text" value={tagsText} onChange={(e) => setTagsText(e.target.value)} className={inputCls} />
      </Field>

      <div>
        <label className="block text-sm font-semibold text-ink mb-2">Gallery</label>
        <div className="space-y-3">
          {slots.map((s, i) => (
            <div key={i} className="border border-line rounded-lg p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <ImageField
                  compact
                  value={s.img}
                  onChange={(url) => setSlots(slots.map((x, j) => (j === i ? { ...x, img: url } : x)))}
                />
                <div className="flex gap-1.5">
                  <SmallBtn title="Move up" disabled={i === 0} onClick={() => setSlots(moveItem(slots, i, i - 1))}>↑</SmallBtn>
                  <SmallBtn title="Move down" disabled={i === slots.length - 1} onClick={() => setSlots(moveItem(slots, i, i + 1))}>↓</SmallBtn>
                  <SmallBtn title="Remove slot" danger onClick={() => setSlots(slots.filter((_, j) => j !== i))}>✕</SmallBtn>
                </div>
              </div>
              <input
                type="text"
                value={s.cap}
                placeholder="Caption (optional)"
                onChange={(e) => setSlots(slots.map((x, j) => (j === i ? { ...x, cap: e.target.value } : x)))}
                className={inputCls}
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSlots([...slots, { img: "", cap: "" }])}
          className="mt-3 px-3 py-2 text-sm border border-line rounded-lg hover:bg-paper-lo"
        >
          + Add gallery image
        </button>
      </div>

      <div>
        <label className="block text-sm font-semibold text-ink mb-2">Color palette</label>
        <div className="space-y-2 mb-2">
          {(f.think?.pal || []).map((color, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="color"
                value={/^#[0-9a-f]{6}$/i.test(color) ? color : "#000000"}
                onChange={(e) => setThink("pal", (f.think?.pal || []).map((c, j) => (j === i ? e.target.value : c)))}
                className="w-10 h-10 rounded border border-line shrink-0 p-0.5 bg-white"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setThink("pal", (f.think?.pal || []).map((c, j) => (j === i ? e.target.value : c)))}
                className={`${inputCls} font-mono`}
              />
              <SmallBtn danger title="Remove" onClick={() => setThink("pal", (f.think?.pal || []).filter((_, j) => j !== i))}>✕</SmallBtn>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setThink("pal", [...(f.think?.pal || []), "#7F011F"])}
          className="px-3 py-2 text-sm border border-line rounded-lg hover:bg-paper-lo"
        >
          + Add color
        </button>
      </div>

      <div className="border-t border-line pt-4">
        <h4 className="font-serif text-lg text-ink mb-3">Design thinking</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(["challenge", "idea", "mark", "craft", "type"] as const).map((k) => (
            <Field key={k} label={k[0].toUpperCase() + k.slice(1)}>
              <TextInput value={String(f.think?.[k] ?? "")} onChange={(v) => setThink(k, v)} multiline rows={2} />
            </Field>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2 sticky bottom-0 bg-white pb-1">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-ink text-paper py-3 rounded-lg font-semibold hover:bg-ink-soft disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save project"}
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-3 border border-line rounded-lg font-semibold hover:bg-paper-lo">
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* UI/UX concepts editor                                               */
/* ------------------------------------------------------------------ */

function UiuxEditor({ value, onChange }: { value: VideoProject[]; onChange: (v: VideoProject[]) => void }) {
  const update = (i: number, patch: Partial<VideoProject>) => onChange(value.map((v, j) => (j === i ? { ...v, ...patch } : v)));

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-serif text-2xl text-ink">UI/UX concepts ({value.length})</h2>
        <button
          onClick={() =>
            onChange([
              ...value,
              { key: `concept-${Date.now().toString(36)}`, title: "New concept", description: "", poster: "", videoUrl: "", redesignUrl: "", tags: [] },
            ])
          }
          className="px-4 py-2 bg-ink text-paper rounded-lg font-semibold hover:bg-ink-soft"
        >
          + Add concept
        </button>
      </div>
      <div className="space-y-4">
        {value.map((v, i) => (
          <div key={v.key} className="bg-white rounded-xl p-4 sm:p-6 border border-line space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold tracking-[0.15em] uppercase text-ink-50">{String(i + 1).padStart(2, "0")}</span>
              <div className="flex gap-1.5">
                <SmallBtn title="Move up" disabled={i === 0} onClick={() => onChange(moveItem(value, i, i - 1))}>↑</SmallBtn>
                <SmallBtn title="Move down" disabled={i === value.length - 1} onClick={() => onChange(moveItem(value, i, i + 1))}>↓</SmallBtn>
                <SmallBtn danger onClick={() => confirm(`Remove "${v.title}"?`) && onChange(value.filter((_, j) => j !== i))}>
                  Delete
                </SmallBtn>
              </div>
            </div>
            <Field label="Title">
              <TextInput value={v.title} onChange={(t) => update(i, { title: t })} />
            </Field>
            <Field label="Description">
              <TextInput value={v.description} onChange={(t) => update(i, { description: t })} multiline rows={3} />
            </Field>
            <Field label="Tags (comma-separated)">
              <input
                type="text"
                defaultValue={v.tags.join(", ")}
                onBlur={(e) => update(i, { tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
                className={inputCls}
              />
            </Field>
            <ImageField label="Poster image" value={v.poster} onChange={(url) => update(i, { poster: url })} aspect={16 / 10} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Prototype link" hint="Opens when the card is tapped, e.g. /uiux/whish-money.html">
                <TextInput value={v.redesignUrl || ""} onChange={(t) => update(i, { redesignUrl: t })} />
              </Field>
              <Field label="Film link" hint="Optional “Watch film” button">
                <TextInput value={v.videoUrl} onChange={(t) => update(i, { videoUrl: t })} />
              </Field>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
