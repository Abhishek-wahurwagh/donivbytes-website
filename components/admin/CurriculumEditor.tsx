"use client";

import { useState, useEffect } from "react";
import {
  listChapters,
  createChapter,
  updateChapter,
  deleteChapter,
  createTopic,
  updateTopic,
  deleteTopic,
  createSubtopic,
  updateSubtopic,
  deleteSubtopic,
  Chapter,
  Topic,
  Subtopic,
} from "@/lib/api";

// ─── Small inline edit input ──────────────────────────────────────────────────

function InlineForm({
  placeholder,
  onSave,
  onCancel,
}: {
  placeholder: string;
  onSave: (title: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!value.trim()) return;
    setSaving(true);
    await onSave(value.trim());
    setSaving(false);
    setValue("");
  }

  return (
    <div className="flex items-center gap-2 mt-2">
      <input
        autoFocus
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") onCancel();
        }}
        placeholder={placeholder}
        className="flex-1 text-sm px-3 py-1.5 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#ffde59] bg-white"
      />
      <button
        onClick={handleSave}
        disabled={saving || !value.trim()}
        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#ffde59] text-black hover:bg-[#e6c800] disabled:opacity-40 transition-colors"
      >
        {saving ? "…" : "Add"}
      </button>
      <button
        onClick={onCancel}
        className="text-xs text-neutral-400 hover:text-black transition-colors px-1"
      >
        Cancel
      </button>
    </div>
  );
}

// ─── Subtopic row ─────────────────────────────────────────────────────────────

function SubtopicRow({
  subtopic,
  onDelete,
}: {
  subtopic: Subtopic;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-1 pl-4 group">
      <div className="flex items-center gap-2">
        <span className="w-1 h-1 rounded-full bg-neutral-300 flex-shrink-0" />
        <span className="text-xs text-neutral-600">{subtopic.title}</span>
      </div>
      <button
        onClick={() => onDelete(subtopic.id)}
        className="text-xs text-neutral-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all ml-2"
        aria-label={`Delete subtopic ${subtopic.title}`}
      >
        ×
      </button>
    </div>
  );
}

// ─── Topic row ────────────────────────────────────────────────────────────────

function TopicRow({
  topic,
  onDelete,
}: {
  topic: Topic & { subtopics: Subtopic[] };
  onDelete: (id: number) => void;
  onSubtopicsChange: (topicId: number, subtopics: Subtopic[]) => void;
}) {
  const [addingSubtopic, setAddingSubtopic] = useState(false);
  const [subtopics, setSubtopics] = useState<Subtopic[]>(topic.subtopics);

  async function handleAddSubtopic(title: string) {
    const sub = await createSubtopic(topic.id, {
      title,
      position: subtopics.length,
    });
    setSubtopics((prev) => [...prev, sub]);
    setAddingSubtopic(false);
  }

  async function handleDeleteSubtopic(id: number) {
    await deleteSubtopic(id);
    setSubtopics((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="ml-4 mb-1">
      <div className="flex items-center justify-between py-1 group">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 flex-shrink-0" />
          <span className="text-sm font-medium text-black">{topic.title}</span>
        </div>
        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setAddingSubtopic(true)}
            className="text-xs text-neutral-400 hover:text-black transition-colors"
          >
            + Subtopic
          </button>
          <button
            onClick={() => onDelete(topic.id)}
            className="text-xs text-neutral-300 hover:text-red-500 transition-colors"
            aria-label={`Delete topic ${topic.title}`}
          >
            ×
          </button>
        </div>
      </div>

      {subtopics.map((sub) => (
        <SubtopicRow
          key={sub.id}
          subtopic={sub}
          onDelete={handleDeleteSubtopic}
        />
      ))}

      {addingSubtopic && (
        <div className="ml-4">
          <InlineForm
            placeholder="Subtopic title"
            onSave={handleAddSubtopic}
            onCancel={() => setAddingSubtopic(false)}
          />
        </div>
      )}
    </div>
  );
}

// ─── Chapter row ──────────────────────────────────────────────────────────────

type TopicWithSubs = Topic & { subtopics: Subtopic[] };
type ChapterWithTopics = Chapter & { topics: TopicWithSubs[] };

function ChapterRow({
  chapter,
  onDelete,
}: {
  chapter: ChapterWithTopics;
  onDelete: (id: number) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [addingTopic, setAddingTopic] = useState(false);
  const [topics, setTopics] = useState<TopicWithSubs[]>(chapter.topics);

  async function handleAddTopic(title: string) {
    const topic = await createTopic(chapter.id, {
      title,
      position: topics.length,
    });
    setTopics((prev) => [...prev, { ...topic, subtopics: [] }]);
    setAddingTopic(false);
  }

  async function handleDeleteTopic(id: number) {
    await deleteTopic(id);
    setTopics((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200 mb-3 overflow-hidden">
      {/* Chapter header */}
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 border-b border-neutral-100 group">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-2 text-left flex-1"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={`transition-transform ${expanded ? "rotate-90" : ""}`}
          >
            <path
              d="M4 2l4 4-4 4"
              stroke="#9ca3af"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-sm font-bold text-black">{chapter.title}</span>
          <span className="text-xs text-neutral-400">
            {topics.length} topic{topics.length !== 1 ? "s" : ""}
          </span>
        </button>
        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => {
              setExpanded(true);
              setAddingTopic(true);
            }}
            className="text-xs text-neutral-400 hover:text-black transition-colors"
          >
            + Topic
          </button>
          <button
            onClick={() => onDelete(chapter.id)}
            className="text-xs text-neutral-300 hover:text-red-500 transition-colors"
            aria-label={`Delete chapter ${chapter.title}`}
          >
            ×
          </button>
        </div>
      </div>

      {/* Topics */}
      {expanded && (
        <div className="px-4 py-3">
          {topics.length === 0 && !addingTopic && (
            <p className="text-xs text-neutral-400 italic">
              No topics yet.{" "}
              <button
                onClick={() => setAddingTopic(true)}
                className="underline hover:text-black transition-colors"
              >
                Add one
              </button>
            </p>
          )}

          {topics.map((topic) => (
            <TopicRow
              key={topic.id}
              topic={topic}
              onDelete={handleDeleteTopic}
              onSubtopicsChange={() => {}}
            />
          ))}

          {addingTopic && (
            <InlineForm
              placeholder="Topic title"
              onSave={handleAddTopic}
              onCancel={() => setAddingTopic(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main editor ──────────────────────────────────────────────────────────────

interface CurriculumEditorProps {
  courseId: number;
}

export default function CurriculumEditor({ courseId }: CurriculumEditorProps) {
  const [chapters, setChapters] = useState<ChapterWithTopics[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingChapter, setAddingChapter] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listChapters(courseId)
      .then((chs) =>
        setChapters(chs.map((c) => ({ ...c, topics: [] as TopicWithSubs[] })))
      )
      .catch((e) => setError(e.message ?? "Failed to load curriculum"))
      .finally(() => setLoading(false));
  }, [courseId]);

  async function handleAddChapter(title: string) {
    try {
      const chapter = await createChapter(courseId, {
        title,
        position: chapters.length,
      });
      setChapters((prev) => [...prev, { ...chapter, topics: [] }]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to add chapter");
    }
    setAddingChapter(false);
  }

  async function handleDeleteChapter(id: number) {
    await deleteChapter(id);
    setChapters((prev) => prev.filter((c) => c.id !== id));
  }

  if (loading) {
    return <p className="text-sm text-neutral-400 py-4">Loading curriculum…</p>;
  }

  return (
    <div>
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {chapters.length === 0 && !addingChapter && (
        <p className="text-sm text-neutral-400 mb-4">
          No chapters yet. Add the first one.
        </p>
      )}

      {chapters.map((chapter) => (
        <ChapterRow
          key={chapter.id}
          chapter={chapter}
          onDelete={handleDeleteChapter}
        />
      ))}

      {addingChapter ? (
        <InlineForm
          placeholder="Chapter title"
          onSave={handleAddChapter}
          onCancel={() => setAddingChapter(false)}
        />
      ) : (
        <button
          onClick={() => setAddingChapter(true)}
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-black border border-dashed border-neutral-300 hover:border-neutral-500 rounded-xl px-4 py-2.5 transition-all w-full justify-center mt-1"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path
              d="M6.5 1v11M1 6.5h11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Add Chapter
        </button>
      )}
    </div>
  );
}
