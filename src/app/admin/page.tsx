"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Users, Wrench, FileText, FlaskConical, LayoutDashboard, Plus, Pencil, Trash2, Check, X, AlertCircle, CheckCircle2, ChevronRight, Loader2, Brain, Flag, Award, Newspaper, BookOpen, Database } from "lucide-react";
import { tools as staticTools } from "@/data/tools";
import { cheatsheets } from "@/data/cheatsheets";
import { labs } from "@/data/labs";
import { quizzes } from "@/data/quizzes";
import { writeups } from "@/data/writeups";
import { certificates } from "@/data/certificates";
import { newsArticles } from "@/data/news";
import { glossaryTerms } from "@/data/glossary";
import { EASE, fadeUp, stagger } from "@/lib/motion";
import { PageSpinner } from "@/components/ui/SkeletonCard";
import { showToast } from "@/components/ui/Toast";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  points?: number;
}

interface DBTool {
  _id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  tags: string[];
}

interface ToolForm {
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string;
  installation: string;
  useCases: string;
  officialDocs: string;
}

const emptyForm: ToolForm = { name: "", slug: "", description: "", category: "", tags: "", installation: "", useCases: "", officialDocs: "" };

type Tab = "overview" | "tools" | "users";

const contentStats = [
  { label: "Static tools", value: staticTools.length, icon: Wrench, tone: "tone-cyan" },
  { label: "Cheat sheets", value: cheatsheets.length, icon: FileText, tone: "tone-violet" },
  { label: "Labs", value: labs.length, icon: FlaskConical, tone: "tone-emerald" },
  { label: "Quizzes", value: quizzes.length, icon: Brain, tone: "tone-fuchsia" },
  { label: "Writeups", value: writeups.length, icon: Flag, tone: "tone-red" },
  { label: "Certifications", value: certificates.length, icon: Award, tone: "tone-amber" },
  { label: "News", value: newsArticles.length, icon: Newspaper, tone: "tone-sky" },
  { label: "Glossary", value: glossaryTerms.length, icon: BookOpen, tone: "tone-indigo" },
];

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [users, setUsers] = useState<User[]>([]);
  const [dbTools, setDbTools] = useState<DBTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [toolForm, setToolForm] = useState<ToolForm>(emptyForm);
  const [editingTool, setEditingTool] = useState<DBTool | null>(null);
  const [toolMessage, setToolMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        if (data.user.role !== "admin") {
          router.push("/dashboard");
          return;
        }
        setLoading(false);
        fetch("/api/admin/users").then((r) => r.json()).then((d) => setUsers(d.users || [])).catch(() => {});
        fetch("/api/admin/tools").then((r) => r.json()).then((d) => setDbTools(d.tools || [])).catch(() => {});
      })
      .catch(() => router.push("/auth/login"));
  }, [router]);

  const submitTool = async (e: React.FormEvent) => {
    e.preventDefault();
    setToolMessage(null);
    const payload = {
      ...toolForm,
      tags: toolForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
      useCases: toolForm.useCases.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      const res = await fetch(editingTool ? `/api/admin/tools/${editingTool._id}` : "/api/admin/tools", {
        method: editingTool ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTool ? payload : { ...payload, commands: [] }),
      });
      const data = await res.json();
      if (!res.ok) {
        setToolMessage({ text: data.error || "Request failed", type: "error" });
        return;
      }
      if (editingTool) {
        setDbTools((prev) => prev.map((t) => (t._id === editingTool._id ? data.tool : t)));
        setToolMessage({ text: "Tool updated", type: "success" });
      } else {
        setDbTools((prev) => [data.tool, ...prev]);
        setToolMessage({ text: "Tool added successfully", type: "success" });
      }
      setEditingTool(null);
      setToolForm(emptyForm);
    } catch {
      setToolMessage({ text: "Network error", type: "error" });
    }
  };

  const handleDeleteTool = async (id: string) => {
    if (!confirm("Delete this tool? This cannot be undone.")) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/tools/${id}`, { method: "DELETE" });
    if (res.ok) {
      setDbTools((prev) => prev.filter((t) => t._id !== id));
      showToast("Tool deleted", "success");
    } else showToast("Failed to delete tool", "error");
    setDeletingId(null);
  };

  const startEdit = (tool: DBTool) => {
    setEditingTool(tool);
    setToolForm({ name: tool.name, slug: tool.slug, description: tool.description, category: tool.category, tags: tool.tags?.join(", ") || "", installation: "", useCases: "", officialDocs: "" });
    setToolMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleRole = async (userId: string) => {
    const res = await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId }) });
    if (res.ok) {
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: u.role === "admin" ? "user" : "admin" } : u)));
      showToast("Role updated", "success");
    } else showToast("Failed to update role", "error");
  };

  if (loading) return <PageSpinner label="Verifying admin access…" />;

  const tabs: { id: Tab; label: string; icon: typeof Shield; count?: number }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "tools", label: "Tools", icon: Wrench, count: dbTools.length },
    { id: "users", label: "Users", icon: Users, count: users.length },
  ];

  const admins = users.filter((u) => u.role === "admin").length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: EASE }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-on-primary shadow-[0_10px_30px_-10px_rgb(var(--glow)/0.7)]" style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}>
            <Shield size={22} />
          </div>
          <div>
            <p className="eyebrow mb-1 text-[10px]">Control room</p>
            <h1 className="font-display text-2xl font-bold leading-tight">Admin panel</h1>
            <p className="text-muted text-sm">Manage content, users, and platform data</p>
          </div>
        </div>

        <div className="flex gap-1 p-1 card rounded-xl w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const on = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${on ? "text-on-primary" : "text-muted hover:text-foreground"}`}>
                {on && <motion.span layoutId="admin-tab" className="absolute inset-0 bg-primary rounded-lg" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon size={15} />
                  {tab.label}
                  {tab.count !== undefined && <span className={`text-[10px] px-1.5 rounded-full tabular-nums ${on ? "bg-black/15" : "bg-surface-2"}`}>{tab.count}</span>}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-6">
            <motion.div variants={stagger(0, 0.04)} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Registered users", value: users.length, icon: Users, tone: "tone-primary" },
                { label: "Admins", value: admins, icon: Shield, tone: "tone-violet" },
                { label: "Tools in DB", value: dbTools.length, icon: Database, tone: "tone-emerald" },
                { label: "Total XP awarded", value: users.reduce((a, u) => a + (u.points ?? 0), 0), icon: Award, tone: "tone-amber" },
              ].map((s) => (
                <motion.div key={s.label} variants={fadeUp} className={`card card-hover p-4 ${s.tone}`}>
                  <span className="tone-icon w-9 h-9 rounded-lg mb-3">
                    <s.icon size={16} />
                  </span>
                  <p className="font-display text-2xl font-bold tabular-nums tone-text">{s.value.toLocaleString()}</p>
                  <p className="text-xs text-muted mt-0.5">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>

            <div className="card p-5">
              <h2 className="font-display font-bold mb-4">Static content inventory</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {contentStats.map((s) => (
                  <div key={s.label} className={`flex items-center gap-3 p-3 rounded-xl border border-border bg-surface-2/40 ${s.tone}`}>
                    <span className="tone-icon w-9 h-9 rounded-lg shrink-0">
                      <s.icon size={15} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-display font-bold tabular-nums leading-none">{s.value}</p>
                      <p className="text-[11px] text-muted mt-1 truncate">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h2 className="font-display font-bold mb-4">Quick actions</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: "Add a new tool", desc: "Create a DB-backed tool entry", action: () => setActiveTab("tools"), icon: Plus },
                  { label: "Manage users", desc: "Promote or demote admins", action: () => setActiveTab("users"), icon: Users },
                ].map((item) => (
                  <button key={item.label} onClick={item.action} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-surface-2/40 hover:border-primary/40 hover:bg-primary/5 transition-all text-left group">
                    <span className="tone-icon tone-primary w-10 h-10 rounded-xl">
                      <item.icon size={17} />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-semibold">{item.label}</span>
                      <span className="block text-xs text-muted">{item.desc}</span>
                    </span>
                    <ChevronRight size={16} className="text-subtle group-hover:translate-x-0.5 group-hover:text-primary transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "tools" && (
          <motion.div key="tools" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-6">
            <div className="card p-6">
              <h2 className="font-display text-lg font-bold mb-5 flex items-center gap-2">
                <span className="tone-icon tone-primary w-8 h-8 rounded-lg">{editingTool ? <Pencil size={15} /> : <Plus size={15} />}</span>
                {editingTool ? `Edit tool: ${editingTool.name}` : "Add new tool"}
              </h2>

              <AnimatePresence>
                {toolMessage && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-5">
                    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm border tone-bg tone-border tone-text ${toolMessage.type === "success" ? "tone-green" : "tone-red"}`}>
                      {toolMessage.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                      {toolMessage.text}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={submitTool} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1.5">Name</label>
                    <input required value={toolForm.name} onChange={(e) => setToolForm({ ...toolForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} className="input" placeholder="Tool name" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1.5">Category</label>
                    <input required value={toolForm.category} onChange={(e) => setToolForm({ ...toolForm, category: e.target.value })} className="input" placeholder="e.g. Web Security" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Description</label>
                  <textarea required rows={3} value={toolForm.description} onChange={(e) => setToolForm({ ...toolForm, description: e.target.value })} className="input resize-none" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1.5">Tags (comma-separated)</label>
                    <input value={toolForm.tags} onChange={(e) => setToolForm({ ...toolForm, tags: e.target.value })} className="input" placeholder="web, scanner, proxy" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1.5">Official docs URL</label>
                    <input value={toolForm.officialDocs} onChange={(e) => setToolForm({ ...toolForm, officialDocs: e.target.value })} className="input" placeholder="https://…" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Installation</label>
                  <textarea rows={2} value={toolForm.installation} onChange={(e) => setToolForm({ ...toolForm, installation: e.target.value })} className="input font-mono text-sm resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Use cases (comma-separated)</label>
                  <input value={toolForm.useCases} onChange={(e) => setToolForm({ ...toolForm, useCases: e.target.value })} className="input" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn btn-primary">
                    {editingTool ? (
                      <>
                        <Check size={16} /> Update tool
                      </>
                    ) : (
                      <>
                        <Plus size={16} /> Add tool
                      </>
                    )}
                  </button>
                  {editingTool && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTool(null);
                        setToolForm(emptyForm);
                        setToolMessage(null);
                      }}
                      className="btn btn-outline"
                    >
                      <X size={16} /> Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="card overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-display font-bold">Tools in database</h2>
                <span className="badge badge-muted tabular-nums">{dbTools.length}</span>
              </div>
              {dbTools.length === 0 ? (
                <p className="px-4 py-10 text-center text-sm text-muted">No DB tools yet. Static tools from the codebase are still served.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {dbTools.map((tool) => (
                    <li key={tool._id} className="flex items-center gap-4 px-4 py-3 hover:bg-surface-2/60 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{tool.name}</p>
                        <p className="text-xs text-muted truncate">
                          {tool.category} · <span className="font-mono">{tool.slug}</span>
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => startEdit(tool)} className="btn btn-sm btn-outline">
                          <Pencil size={12} /> Edit
                        </button>
                        <button onClick={() => handleDeleteTool(tool._id)} disabled={deletingId === tool._id} className="btn btn-sm btn-danger">
                          {deletingId === tool._id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "users" && (
          <motion.div key="users" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="card overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-display font-bold">Registered users</h2>
              <span className="badge badge-muted tabular-nums">{users.length}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-2/60 text-[11px] uppercase tracking-wider text-muted">
                    <th className="text-left px-4 py-3 font-semibold">Name</th>
                    <th className="text-left px-4 py-3 font-semibold">Email</th>
                    <th className="text-left px-4 py-3 font-semibold">Role</th>
                    <th className="text-left px-4 py-3 font-semibold">XP</th>
                    <th className="text-left px-4 py-3 font-semibold">Joined</th>
                    <th className="text-right px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-border last:border-0 hover:bg-surface-2/60 transition-colors">
                      <td className="px-4 py-3 font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-muted">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={u.role === "admin" ? "tone-badge tone-primary" : "badge badge-muted"}>{u.role}</span>
                      </td>
                      <td className="px-4 py-3 text-muted tabular-nums">{u.points ?? 0}</td>
                      <td className="px-4 py-3 text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => handleToggleRole(u._id)} className="btn btn-sm btn-outline">
                          {u.role === "admin" ? "Demote" : "Promote"}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-muted">
                        No users found. Make sure MongoDB is connected.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
