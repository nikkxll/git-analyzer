"use client";

import { useState, useEffect } from "react";

/**
 * A custom React hook that syncs state with localStorage.
 *
 * @typeParam T - The template for the type of the value being stored
 * @param key - The localStorage key to store the value under
 * @param initialValue - The initial value to use if no value is stored
 *
 * @returns A tuple containing the current value and a setter function
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    }
    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
