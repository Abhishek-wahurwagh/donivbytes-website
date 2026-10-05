"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPublicCourses, getMyCourses, getToken, PublicCourse, MyCourse } from "@/lib/api";

function difficultyLabel(d: string | null) {
  if (!d) return null;
  return d.charAt(0) + d.slice(1).toLowerCase();
}

function CourseCard({
  course,
  enrolledMap,
}: {
  course: PublicCourse;
  enrolledMap: Map<number, MyCourse>;
}) {
  const enrolled = enrolledMap.get(course.id);
  const hasToken = !!getToken();

  return (
    <div className="group flex flex-col h-full bg-white rounded-2xl border border-neutral-100 hover:border-neutral-300 hover:shadow-sm transition-all duration-300 overflow-hidden">
      {/* Thumbnail placeholder */}
      <div className="h-36 bg-neutral-50 flex items-center justify-center border-b border-neutral-100">
        {course.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-3xl font-bold text-neutral-200 tracking-tight">
            {course.title.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        {/* Meta row */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {difficultyLabel(course.difficulty) && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500">
              {difficultyLabel(course.difficulty)}
            </span>
          )}
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              course.enrollment_type === "FREE"
                ? "bg-blue-50 text-blue-600"
                : "bg-[#ffde59]/30 text-black"
            }`}
          >
            {course.enrollment_type === "FREE"
              ? "Free"
              : course.price
              ? `₹${course.price.toLocaleString()}`
              : "Paid"}
          </span>
        </div>

        <h3 className="font-bold text-black leading-snug mb-2">{course.title}</h3>

        {course.short_description && (
          <p className="text-sm text-neutral-500 leading-relaxed mb-4 flex-1 line-clamp-3">
            {course.short_description}
          </p>
        )}

        {course.start_date && (
          <p className="text-xs text-neutral-400 mb-4">
            Starts{" "}
            {new Date(course.start_date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        )}

        {/* CTA */}
        <div className="mt-auto">
          {enrolled ? (
            <Link
              href={`/learn/courses/${course.id}/learn`}
              className="block w-full text-center bg-black text-white text-sm font-semibold py-2 rounded-full hover:bg-neutral-800 transition-colors"
            >
              Continue Learning
            </Link>
          ) : !hasToken ? (
            <Link
              href={`/login?next=/learn/courses/${course.id}`}
              className="block w-full text-center border border-black text-black text-sm font-semibold py-2 rounded-full hover:bg-neutral-50 transition-colors"
            >
              Sign in to enroll
            </Link>
          ) : (
            <Link
              href={`/learn/courses/${course.id}`}
              className="block w-full text-center bg-[#ffde59] text-black text-sm font-semibold py-2 rounded-full hover:bg-[#e6c800] transition-colors"
            >
              Enroll Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PublicCourseGrid() {
  const [courses, setCourses] = useState<PublicCourse[]>([]);
  const [enrolledMap, setEnrolledMap] = useState<Map<number, MyCourse>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [courseList, myList] = await Promise.allSettled([
        getPublicCourses(),
        getToken() ? getMyCourses() : Promise.resolve([]),
      ]);

      if (courseList.status === "fulfilled") setCourses(courseList.value);
      if (myList.status === "fulfilled") {
        const map = new Map<number, MyCourse>();
        myList.value.forEach((mc) => map.set(mc.course.id, mc));
        setEnrolledMap(map);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 rounded-2xl bg-neutral-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-neutral-400 text-sm">Courses are being prepared. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} enrolledMap={enrolledMap} />
      ))}
    </div>
  );
}
