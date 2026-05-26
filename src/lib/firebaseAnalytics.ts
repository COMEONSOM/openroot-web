import app from "./firebase";

export async function initAnalytics(): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;
  if (!measurementId) {
    return;
  }

  const { getAnalytics, isSupported } = await import("firebase/analytics");
  if (await isSupported()) {
    getAnalytics(app);
  }
}
