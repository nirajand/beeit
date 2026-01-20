
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sanitize = (val: string) => {
  if (typeof val !== 'string') return val;
  return val
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
    .replace(/[<>"'/]/g, (m) => ({
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#47;'
    }[m] || m))
    .trim();
};
