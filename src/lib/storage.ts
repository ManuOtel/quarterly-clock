import type { Project } from "./types";

const STORAGE_KEY = "quarter-clock";

export type StoredData = {
  projects: Project[];
};

export const createEmptyData = (): StoredData => ({ projects: [] });

const isBrowser = () => typeof window !== "undefined";

const normalizeData = (data: unknown): StoredData => {
  if (!data || typeof data !== "object") return createEmptyData();
  const projects = Array.isArray((data as StoredData).projects)
    ? (data as StoredData).projects
    : [];
  return { projects };
};

export const loadData = (): StoredData => {
  if (!isBrowser()) return createEmptyData();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyData();
    return normalizeData(JSON.parse(raw));
  } catch {
    return createEmptyData();
  }
};

export const saveData = (data: StoredData) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const exportData = (data: StoredData) => {
  if (!isBrowser()) return;
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quarter-clock-data.json";
  link.click();
  URL.revokeObjectURL(url);
};

export const importDataFromFile = async (file: File): Promise<StoredData> => {
  const text = await file.text();
  return normalizeData(JSON.parse(text));
};
