"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => undefined;

export function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
