"use client";

import { useState, FormEvent } from "react";
import { Course, EnrollmentType, CourseStatus, CourseDifficulty } from "@/lib/api";

export interface CourseFormValues {
  title: string;
  slug: string;
  short_description: string;
  description: string;
  difficulty: CourseDifficulty | "";
  thumbnail_url: string;
  start_date: string;
  enrollment_type: EnrollmentType;
  price: string;
  status: CourseStatus;
}

interface CourseFormProps {
  initial?: Partial<Course>;
  onSubmit: (values: CourseFormValues) => Promise<void>;
  submitLabel: string;
  loading: boolean;
  error: string | null;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function CourseForm({
  initial,
  onSubmit,
  submitLabel,
  loading,
  error,
}: CourseFormProps) {
  const [values, setValues] = useState<CourseFormValues>({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    short_description: initial?.short_description ?? "",
    description: initial?.description ?? "",
    difficulty: initial?.difficulty ?? "",
    thumbnail_url: initial?.thumbnail_url ?? "",
    start_date: initial?.start_date
      ? initial.start_date.slice(0, 16)
      : "",
    enrollment_type: initial?.enrollment_type ?? "FREE",
    price: initial?.price != null ? String(initial.price) : "",
    status: initial?.status ?? "DRAFT",
  });

  function set(field: keyof CourseFormValues, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  function handleTitleChange(value: string) {
    setValues((v) => ({
      ...v,
      title: value,
      slug: initial?.slug ? v.slug : slugify(value),
    }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  const isPaid = values.enrollment_type === "PAID";

  const labelCls = "block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wider";
  const inputCls =
    "w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#ffde59] focus:border-transparent transition";
  const selectCls = inputCls + " cursor-pointer";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className={labelCls}>
          Title <span className="text-red-400">*</span>
        </label>
        <input
          id="title"
          type="text"
          required
          value={values.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className={inputCls}
          placeholder="e.g. Linux Fundamentals"
        />
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className={labelCls}>
          Slug <span className="text-red-400">*</span>
        </label>
        <input
          id="slug"
          type="text"
          required
          value={values.slug}
          onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
          className={inputCls + " font-mono"}
          placeholder="linux-fundamentals"
        />
        <p className="text-xs text-neutral-400 mt-1">
          Auto-generated from title. Must be unique.
        </p>
      </div>

      {/* Short description */}
      <div>
        <label htmlFor="short_description" className={labelCls}>
          Short Description
        </label>
        <input
          id="short_description"
          type="text"
          value={values.short_description}
          onChange={(e) => set("short_description", e.target.value)}
          className={inputCls}
          placeholder="One-line summary shown in course listings"
          maxLength={1000}
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className={labelCls}>
          Description
        </label>
        <textarea
          id="description"
          rows={5}
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          className={inputCls + " resize-y"}
          placeholder="Full course description"
        />
      </div>

      {/* Difficulty + Status row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="difficulty" className={labelCls}>
            Difficulty
          </label>
          <select
            id="difficulty"
            value={values.difficulty}
            onChange={(e) => set("difficulty", e.target.value)}
            className={selectCls}
          >
            <option value="">— Not set —</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>

        <div>
          <label htmlFor="status" className={labelCls}>
            Status
          </label>
          <select
            id="status"
            value={values.status}
            onChange={(e) => set("status", e.target.value as CourseStatus)}
            className={selectCls}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>
      </div>

      {/* Enrollment type */}
      <div>
        <p className={labelCls}>Enrollment Type</p>
        <div className="flex gap-3">
          {(["FREE", "PAID"] as EnrollmentType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => set("enrollment_type", type)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                values.enrollment_type === type
                  ? "bg-[#ffde59] border-[#ffde59] text-black"
                  : "bg-white border-neutral-200 text-neutral-500 hover:border-neutral-400"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Price — only shown for PAID */}
      {isPaid && (
        <div>
          <label htmlFor="price" className={labelCls}>
            Price (₹) <span className="text-red-400">*</span>
          </label>
          <input
            id="price"
            type="number"
            min="1"
            step="1"
            required={isPaid}
            value={values.price}
            onChange={(e) => set("price", e.target.value)}
            className={inputCls}
            placeholder="e.g. 999"
          />
        </div>
      )}

      {/* Thumbnail URL */}
      <div>
        <label htmlFor="thumbnail_url" className={labelCls}>
          Thumbnail URL
        </label>
        <input
          id="thumbnail_url"
          type="url"
          value={values.thumbnail_url}
          onChange={(e) => set("thumbnail_url", e.target.value)}
          className={inputCls}
          placeholder="https://..."
        />
      </div>

      {/* Start date */}
      <div>
        <label htmlFor="start_date" className={labelCls}>
          Start Date
        </label>
        <input
          id="start_date"
          type="datetime-local"
          value={values.start_date}
          onChange={(e) => set("start_date", e.target.value)}
          className={inputCls}
        />
      </div>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#ffde59] text-black font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-[#e6c800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
