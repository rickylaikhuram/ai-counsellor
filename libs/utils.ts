import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeGpa(
  gpa: number,
  scale: "4.0" | "10.0" | "100",
): number {
  switch (scale) {
    case "4.0":
      return (gpa / 4.0) * 100;
    case "10.0":
      return (gpa / 10.0) * 100;
    case "100":
      return gpa;
    default:
      return 0;
  }
}