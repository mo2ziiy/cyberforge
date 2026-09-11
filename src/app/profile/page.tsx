"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Shield, Zap, Flame, CheckCircle2, BookOpen, Pencil, Check, X, Lock, Eye, EyeOff, Trophy, Star, MapPin, Globe, Github, Camera, Save, BarChart2, Award, Heart } from "lucide-react";
import { tracks } from "@/data/tracks";
import { trackIconMap, trackToneClass } from "@/lib/trackIcons";
import { EASE } from "@/lib/motion";
import StreakBadge from "@/components/ui/StreakBadge";
import { showToast } from "@/components/ui/Toast";
import { PageSpinner } from "@/components/ui/SkeletonCard";
import { XLogo } from "@/components/ui/XLogo";

interface UserData {
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  github: string | null;
  twitter: string | null;
  points: number;
  streak: number;
  completedTopics: string[];
  favoriteTools: string[];
  bookmarks: string[];
  createdAt?: string;
}

const totalTopics = tracks.reduce((a, t) => a + t.topics.length, 0);

const achievements = [
  { id: "first_login", label: "First Login", icon: Star, desc: "Joined CyberForge", tone: "tone-primary", check: () => true },
  { id: "10_topics", label: "Knowledge Seeker", icon: BookOpen, desc: "Complete 10 topics", tone: "tone-blue", check: (u: UserData) => u.completedTopics.length >= 10 },
  { id: "50_topics", label: "Security Scholar", icon: Trophy, desc: "Complete 50 topics", tone: "tone-amber", check: (u: UserData) => u.completedTopics.length >= 50 },
  { id: "5_tools", label: "Tool Collector", icon: Heart, desc: "Favorite 5 tools", tone: "tone-violet", check: (u: UserData) => u.favoriteTools.length >= 5 },
  { id: "streak_7", label: "Week Warrior", icon: Flame, desc: "7-day streak", tone: "tone-orange", check: (u: UserData) => u.streak >= 7 },
  { id: "streak_30", label: "Month Master", icon: Flame, desc: "30-day streak", tone: "tone-red", check: (u: UserData) => u.streak >= 30 },
  { id: "100_pts", label: "Point Earner", icon: Zap, desc: "Earn 100 XP", tone: "tone-yellow", check: (u: UserData) => u.points >= 100 },
  { id: "bookmarks_5", label: "Resourceful", icon: Award, desc: "Bookmark 5 resources", tone: "tone-emerald", check: (u: UserData) => u.bookmarks.length >= 5 },
];

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 180;
        let w = img.width;
        let h = img.height;
        if (w > h) {
          h = Math.round((h * MAX) / w);
          w = MAX;
        } else {
          w = Math.round((w * MAX) / h);
          h = MAX;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas error"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay, ease: EASE } });

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingAbout, setEditingAbout] = useState(false);
  const [aboutForm, setAboutForm] = useState({ bio: "", location: "", website: "", github: "", twitter: "" });
  const [showPwForm, setShowPwForm] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setUser(data.user);
        setNewName(data.user.name);
        setAboutForm({ bio: data.user.bio ?? "", location: data.user.location ?? "", website: data.user.website ?? "", github: data.user.github ?? "", twitter: data.user.twitter ?? "" });
      })
      .catch(() => router.push("/auth/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const patchProfile = async (fields: Record<string, string | null>) => {
    const res = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fields) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed");
    return data.user;
  };

  const saveName = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      await patchProfile({ name: newName.trim() });
      setUser((prev) => (prev ? { ...prev, name: newName.trim() } : prev));
      setEditingName(false);
      showToast("Name updated", "success");
    } catch {
      showToast("Failed to update name", "error");
    } finally {
      setSaving(false);
    }
  };

  const saveAbout = async () => {
    setSaving(true);
    try {
      await patchProfile({ bio: aboutForm.bio || null, location: aboutForm.location || null, website: aboutForm.website || null, github: aboutForm.github || null, twitter: aboutForm.twitter || null });
      setUser((prev) => (prev ? { ...prev, ...aboutForm } : prev));
      setEditingAbout(false);
      showToast("Profile updated", "success");
    } catch {
      showToast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file", "error");
      return;
    }
    setSaving(true);
    try {
      const compressed = await compressImage(file);
      await patchProfile({ avatar: compressed });
      setUser((prev) => (prev ? { ...prev, avatar: compressed } : prev));
      showToast("Avatar updated", "success");
    } catch {
      showToast("Failed to upload avatar", "error");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) return showToast("Passwords don't match", "error");
    if (pwForm.newPw.length < 6) return showToast("Password too short", "error");
    setPwLoading(true);
    const res = await fetch("/api/profile/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.newPw }) });
    const data = await res.json();
    if (res.ok) {
      showToast("Password changed", "success");
      setShowPwForm(false);
      setPwForm({ current: "", newPw: "", confirm: "" });
    } else showToast(data.error || "Failed to change password", "error");
    setPwLoading(false);
  };

  if (loading) return <PageSpinner label="Loading profile…" />;
  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const progress = Math.round((user.completedTopics.length / totalTopics) * 100);
  const unlockedCount = achievements.filter((a) => a.check(user)).length;
  const done = new Set(user.completedTopics);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header card */}
      <motion.div {...fade(0)} className="card hairline-top overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgb(var(--glow) / 0.10), transparent 60%)" }} />
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
        <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <div className="relative shrink-0 group">
            <div className="w-28 h-28 rounded-3xl overflow-hidden flex items-center justify-center text-on-primary font-display font-bold text-3xl shadow-[0_16px_40px_-14px_rgb(var(--glow)/0.7)]" style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}>
              {user.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <button onClick={() => fileInputRef.current?.click()} disabled={saving} className="absolute inset-0 bg-black/60 rounded-3xl flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-white text-xs font-medium" aria-label="Change avatar">
              <Camera size={20} />
              Change
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input value={newName} onChange={(e) => setNewName(e.target.value)} className="input font-display text-lg font-bold w-56 py-1.5" onKeyDown={(e) => e.key === "Enter" && saveName()} autoFocus />
                  <button onClick={saveName} disabled={saving} className="icon-btn w-9 h-9 tone-green tone-bg tone-text" aria-label="Save">
                    <Check size={15} />
                  </button>
                  <button
                    onClick={() => {
                      setEditingName(false);
                      setNewName(user.name);
                    }}
                    className="icon-btn w-9 h-9"
                    aria-label="Cancel"
                  >
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold truncate">{user.name}</h1>
                  <button onClick={() => setEditingName(true)} className="icon-btn w-8 h-8 rounded-md" aria-label="Edit name">
                    <Pencil size={14} />
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2 text-muted text-sm mb-3 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Mail size={13} />
                {user.email}
              </span>
              {user.role === "admin" && (
                <span className="tone-badge tone-primary">
                  <Shield size={10} />
                  Admin
                </span>
              )}
            </div>

            {user.bio && <p className="text-sm text-muted mb-3 max-w-md leading-relaxed">{user.bio}</p>}

            <div className="flex flex-wrap gap-3 justify-center sm:justify-start text-xs text-muted mb-4">
              {user.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-primary" />
                  {user.location}
                </span>
              )}
              {user.website && (
                <a href={user.website.startsWith("http") ? user.website : `https://${user.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Globe size={12} className="text-secondary" />
                  {user.website.replace(/^https?:\/\//, "")}
                </a>
              )}
              {user.github && (
                <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Github size={12} />
                  {user.github}
                </a>
              )}
              {user.twitter && (
                <a href={`https://x.com/${user.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                  <XLogo size={11} />
                  {user.twitter}
                </a>
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <span className="tone-badge tone-amber py-1.5 px-3 text-sm">
                <Zap size={13} />
                <span className="tabular-nums">{user.points}</span> XP
              </span>
              <StreakBadge streak={user.streak} />
              <span className="tone-badge tone-primary py-1.5 px-3 text-sm">
                <CheckCircle2 size={13} />
                {progress}% complete
              </span>
              <span className="badge badge-muted py-1.5 px-3">Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : "recently"}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div {...fade(0.05)} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Topics done", value: user.completedTopics.length, icon: CheckCircle2, tone: "tone-green" },
          { label: "XP points", value: user.points, icon: Zap, tone: "tone-amber" },
          { label: "Day streak", value: user.streak, icon: Flame, tone: "tone-orange" },
          { label: "Bookmarks", value: user.bookmarks.length, icon: BookOpen, tone: "tone-violet" },
        ].map((s) => (
          <div key={s.label} className={`card card-hover p-4 text-center ${s.tone}`}>
            <span className="tone-icon w-9 h-9 rounded-lg mx-auto mb-2">
              <s.icon size={16} />
            </span>
            <p className="font-display text-2xl font-bold tabular-nums tone-text">{s.value}</p>
            <p className="text-xs text-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* About */}
        <motion.div {...fade(0.1)} className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg flex items-center gap-2">
              <User size={17} className="text-primary" /> About
            </h2>
            {!editingAbout ? (
              <button onClick={() => setEditingAbout(true)} className="btn btn-ghost btn-sm">
                <Pencil size={13} /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={saveAbout} disabled={saving} className="btn btn-primary btn-sm">
                  <Save size={13} />
                  {saving ? "Saving…" : "Save"}
                </button>
                <button onClick={() => setEditingAbout(false)} className="btn btn-outline btn-sm">
                  <X size={13} /> Cancel
                </button>
              </div>
            )}
          </div>

          {editingAbout ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-muted mb-1">
                  Bio <span className="text-subtle">({aboutForm.bio.length}/200)</span>
                </label>
                <textarea value={aboutForm.bio} maxLength={200} onChange={(e) => setAboutForm({ ...aboutForm, bio: e.target.value })} className="input resize-none text-sm" rows={3} placeholder="Tell us about yourself…" />
              </div>
              {[
                { key: "location", label: "Location", icon: MapPin, placeholder: "City, Country" },
                { key: "website", label: "Website", icon: Globe, placeholder: "https://yoursite.com" },
                { key: "github", label: "GitHub username", icon: Github, placeholder: "username" },
                { key: "twitter", label: "X handle", icon: XLogo, placeholder: "username" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs text-muted mb-1">{f.label}</label>
                  <div className="relative">
                    <f.icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
                    <input value={aboutForm[f.key as keyof typeof aboutForm]} onChange={(e) => setAboutForm({ ...aboutForm, [f.key]: e.target.value })} className="input pl-9 text-sm" placeholder={f.placeholder} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {user.bio ? <p className="text-sm text-muted leading-relaxed">{user.bio}</p> : <p className="text-sm text-subtle italic">No bio yet. Click Edit to add one.</p>}
              <div className="space-y-2 pt-1">
                {user.location && (
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <MapPin size={14} className="text-primary" />
                    {user.location}
                  </div>
                )}
                {user.website && (
                  <a href={user.website.startsWith("http") ? user.website : `https://${user.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors">
                    <Globe size={14} className="text-secondary" />
                    {user.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
                {user.github && (
                  <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors">
                    <Github size={14} />
                    {user.github}
                  </a>
                )}
                {user.twitter && (
                  <a href={`https://x.com/${user.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors">
                    <XLogo size={13} />
                    {user.twitter}
                  </a>
                )}
                {!user.location && !user.website && !user.github && !user.twitter && !user.bio && <p className="text-sm text-subtle italic">No profile info yet.</p>}
              </div>
            </div>
          )}
        </motion.div>

        {/* Achievements */}
        <motion.div {...fade(0.15)} className="card p-5">
          <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <Star size={17} className="text-warning" /> Achievements
            <span className="ml-auto text-sm text-muted font-normal tabular-nums">
              {unlockedCount}/{achievements.length}
            </span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-2">
            {achievements.map((a) => {
              const unlocked = a.check(user);
              const AIcon = a.icon;
              return (
                <div key={a.id} title={a.desc} className={`p-3 rounded-xl border text-center transition-all ${a.tone} ${unlocked ? "tone-border tone-bg" : "border-border bg-surface-2/40 opacity-50 grayscale"}`}>
                  <span className="tone-icon w-9 h-9 rounded-lg mx-auto mb-1.5">
                    <AIcon size={16} />
                  </span>
                  <p className="text-xs font-semibold leading-tight">{a.label}</p>
                  <p className="text-[10px] text-subtle mt-0.5 leading-tight">{a.desc}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Track progress */}
      <motion.div {...fade(0.2)} className="card p-5">
        <h2 className="font-display font-bold text-lg mb-5 flex items-center gap-2">
          <BarChart2 size={17} className="text-primary" /> Learning progress
          <span className="ml-auto text-sm text-muted font-normal tabular-nums">
            {user.completedTopics.length}/{totalTopics} topics
          </span>
        </h2>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
          {tracks.map((track, i) => {
            const Icon = trackIconMap[track.id];
            const completed = track.topics.filter((t) => done.has(t)).length;
            const pct = track.topics.length ? Math.round((completed / track.topics.length) * 100) : 0;
            return (
              <div key={track.id} className={trackToneClass(track.id)}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-2 font-medium">
                    <span className="tone-icon w-6 h-6 rounded-md">{Icon && <Icon size={12} />}</span>
                    {track.name}
                  </span>
                  <span className="text-muted tabular-nums">
                    {completed}/{track.topics.length} <span className="tone-text font-semibold">{pct}%</span>
                  </span>
                </div>
                <div className="progress h-1.5">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, delay: 0.3 + i * 0.05, ease: EASE }} className="h-full rounded-full" style={{ background: "rgb(var(--tone))" }} />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Security */}
      <motion.div {...fade(0.25)} className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg flex items-center gap-2">
            <Lock size={17} className="text-primary" /> Security
          </h2>
          <button onClick={() => setShowPwForm(!showPwForm)} className="btn btn-outline btn-sm">
            {showPwForm ? "Cancel" : "Change password"}
          </button>
        </div>

        {showPwForm ? (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} onSubmit={changePassword} className="space-y-4 border-t border-border pt-4 overflow-hidden">
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: "Current password", key: "current" },
                { label: "New password", key: "newPw" },
                { label: "Confirm password", key: "confirm" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-muted mb-1.5">{field.label}</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
                    <input type={showPw ? "text" : "password"} required value={pwForm[field.key as keyof typeof pwForm]} onChange={(e) => setPwForm({ ...pwForm, [field.key]: e.target.value })} className="input pl-9 pr-9" />
                    {field.key === "newPw" && (
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-foreground" aria-label="Toggle password visibility">
                        {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button type="submit" disabled={pwLoading} className="btn btn-primary">
              {pwLoading ? (
                <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
              ) : (
                <>
                  <Check size={15} /> Save password
                </>
              )}
            </button>
          </motion.form>
        ) : (
          <p className="text-sm text-muted">Manage your account password. Use at least 6 characters with a mix of letters, numbers and symbols.</p>
        )}
      </motion.div>
    </div>
  );
}
