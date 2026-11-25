const STORAGE_KEY = "workadda_saved_workers";
const SAVED_EVENT = "workadda:saved-changed";

export function getSavedWorkerIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function isWorkerSaved(workerId: string): boolean {
  return getSavedWorkerIds().includes(workerId);
}

export function toggleSavedWorker(workerId: string): boolean {
  if (typeof window === "undefined") return false;
  const current = getSavedWorkerIds();
  const exists = current.includes(workerId);
  const next = exists ? current.filter((id) => id !== workerId) : [workerId, ...current];
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(SAVED_EVENT));
  } catch {
    // Ignore storage quota errors
  }
  return !exists;
}

export function subscribeSavedWorkers(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener(SAVED_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(SAVED_EVENT, handler);
  };
}
