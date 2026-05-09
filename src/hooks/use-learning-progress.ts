"use client";

import { useMemo, useSyncExternalStore } from "react";

const storageKey = "acklab.completedModules";
const progressEvent = "acklab:learning-progress";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(progressEvent, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(progressEvent, callback);
  };
}

function getStoredValue() {
  return window.localStorage.getItem(storageKey) ?? "[]";
}

function getServerValue() {
  return "[]";
}

function parseCompletedIds(value: string) {
  try {
    const parsed = JSON.parse(value);

    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function persist(nextIds: string[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(nextIds));
  window.dispatchEvent(new Event(progressEvent));
}

export function useLearningProgress() {
  const storedValue = useSyncExternalStore(subscribe, getStoredValue, getServerValue);
  const completedIds = useMemo(() => parseCompletedIds(storedValue), [storedValue]);
  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);

  function markCompleted(moduleId: string) {
    if (completedSet.has(moduleId)) {
      return;
    }

    persist([...completedIds, moduleId]);
  }

  function toggleCompleted(moduleId: string) {
    if (completedSet.has(moduleId)) {
      persist(completedIds.filter((id) => id !== moduleId));
      return;
    }

    persist([...completedIds, moduleId]);
  }

  return {
    completedIds,
    hydrated: true,
    isCompleted: (moduleId: string) => completedSet.has(moduleId),
    markCompleted,
    toggleCompleted
  };
}
