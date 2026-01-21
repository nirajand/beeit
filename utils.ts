
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

export const parseMarkdown = (text: string) => {
  if (!text) return '';
  
  // Basic Markdown Parser
  let html = text
    // Headers
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mt-4 mb-2 font-heading">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-6 mb-3 font-heading">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-8 mb-4 font-heading">$1</h1>')
    
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Lists
    .replace(/^\s*-\s+(.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
    
    // Links [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-hive-gold hover:underline">$1</a>')
    
    // Newlines to breaks (careful not to break HTML tags if mixed)
    .replace(/\n/g, '<br />');

  return html;
};
