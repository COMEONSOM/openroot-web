// ============================================================
// COURSE CARD ANIMATION DATA
// ============================================================

import { useEffect, useState } from "react";
import { COURSE_DATA } from "../data/courseData";

type LottieData = Record<string, unknown> | null;

export default function useCourseAnimations() {
  const [animations, setAnimations] = useState<Record<string, LottieData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async (): Promise<void> => {
      try {
        const entries = await Promise.all(COURSE_DATA.map(async (course) => {
          try {
            const res = await fetch(course.animationFile);
            if (!res.ok) throw new Error(`Failed to load ${course.animationFile}`);
            return [course.animationFile, await res.json() as Record<string, unknown>] as const;
          } catch {
            return [course.animationFile, null] as const;
          }
        }));
        if (!cancelled) setAnimations(Object.fromEntries(entries));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  return { animations, loading };
}
