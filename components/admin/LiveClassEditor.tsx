"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  listAdminLiveClasses,
  createAdminLiveClass,
  updateAdminLiveClass,
  deleteAdminLiveClass,
  LiveClass,
  LiveClassInput,
  ApiError,
} from "@/lib/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toIST(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toLocalInput(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const empty: LiveClassInput = {
  title: "",
  description: "",
  start_time: "",
  end_time: "",
  meet_url: "",
};

// ─── Form ─────────────────────────────────────────────────────────────────────

function LiveClassForm({
  initial,
  onSave,
  onCancel,
  saving,
  error,
}: {
  initial: LiveClassInput;
  onSave: (v: LiveClassInput) => void;
  onCancel: () => void;
  saving: boolean;
  error: string | null;
}) {
  const [v, setV] = useState<LiveClassInput>(initial);

  function set(field: keyof LiveClassInput, value: string) {
    setV((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSave({
      ...v,
      start_time: new Date(v.start_time).toISOString(),
      end_time: new Date(v.end_time).toISOString(),
    });
  }

  const inputCls =
    "w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#ffde59] focus:border-transparent transition";
  const labelCls = "block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wider";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4 p-5 bg-neutral-50 rounded-2xl border border-neutral-200">
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div>
        <label className={labelCls}>Title *</label>
        <input
          type="text"
          required
          value={v.title}
          onChange={(e) => set("title", e.target.value)}
          className={inputCls}
          placeholder="e.g. Linux Networking — Live Q&A"
        />
      </div>

      <div>
        <label className={labelCls}>Description</label>
        <textarea
          rows={2}
          value={v.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
          className={inputCls + " resize-none"}
          placeholder="Optional details about this session"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Start Time *</label>
          <input
            type="datetime-local"
            required
            value={v.start_time}
            onChange={(e) => set("start_time", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>End Time *</label>
          <input
            type="datetime-local"
            required
            value={v.end_time}
            onChange={(e) => set("end_time", e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Google Meet URL *</label>
        <input
          type="url"
          required
          value={v.meet_url}
          onChange={(e) => set("meet_url", e.target.value)}
          className={inputCls}
          placeholder="https://meet.google.com/xxx-xxxx-xxx"
        />
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#ffde59] text-black font-semibold text-sm px-5 py-2 rounded-full hover:bg-[#e6c800] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Class"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-neutral-400 hover:text-black transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Main editor ──────────────────────────────────────────────────────────────

export default function LiveClassEditor({ courseId }: { courseId: number }) {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  function load() {
    listAdminLiveClasses(courseId)
      .then(setClasses)
      .catch((e) => setError(e.message ?? "Failed to load"))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [courseId]);

  async function handleCreate(v: LiveClassInput) {
    setSaving(true);
    setError(null);
    try {
      const lc = await createAdminLiveClass(courseId, v);
      setClasses((prev) => [...prev, lc].sort(
        (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      ));
      setShowForm(false);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to create");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: number, v: LiveClassInput) {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateAdminLiveClass(id, v);
      setClasses((prev) => prev.map((lc) => (lc.id === id ? updated : lc)));
      setEditId(null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this live class?")) return;
    setDeleteId(id);
    try {
      await deleteAdminLiveClass(id);
      setClasses((prev) => prev.filter((lc) => lc.id !== id));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to delete");
    } finally {
      setDeleteId(null);
    }
  }

  if (loading) return <p className="text-sm text-neutral-400 py-4">Loading…</p>;

  return (
    <div>
      {error && !showForm && !editId && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {classes.length === 0 && !showForm && (
        <p className="text-sm text-neutral-400 mb-4">No live classes yet.</p>
      )}

      {/* Class list */}
      <div className="space-y-3 mb-4">
        {classes.map((lc) => (
          <div key={lc.id}>
            {editId === lc.id ? (
              <LiveClassForm
                initial={{
                  title: lc.title,
                  description: lc.description ?? "",
                  start_time: toLocalInput(lc.start_time),
                  end_time: toLocalInput(lc.end_time),
                  meet_url: lc.meet_url,
                }}
                onSave={(v) => handleUpdate(lc.id, v)}
                onCancel={() => setEditId(null)}
                saving={saving}
                error={editId === lc.id ? error : null}
              />
            ) : (
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-neutral-200 group">
                <div>
                  <p className="text-sm font-semibold text-black">{lc.title}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {toIST(lc.start_time)} — {toIST(lc.end_time)}
                  </p>
                </div>
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setEditId(lc.id); setShowForm(false); }}
                    className="text-xs font-medium text-neutral-500 hover:text-black transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(lc.id)}
                    disabled={deleteId === lc.id}
                    className="text-xs font-medium text-red-400 hover:text-red-600 transition-colors disabled:opacity-40"
                  >
                    {deleteId === lc.id ? "…" : "Delete"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add form */}
      {showForm ? (
        <LiveClassForm
          initial={empty}
          onSave={handleCreate}
          onCancel={() => setShowForm(false)}
          saving={saving}
          error={showForm ? error : null}
        />
      ) : (
        <button
          onClick={() => { setShowForm(true); setEditId(null); }}
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-black border border-dashed border-neutral-300 hover:border-neutral-500 rounded-xl px-4 py-2.5 transition-all w-full justify-center"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Add Live Class
        </button>
      )}
    </div>
  );
}
