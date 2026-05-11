/* ─── TAG PALETTE ─────────────────────────────────────────── */
export const TAG_PALETTE = {
  ChatGPT:     { bg: "#EFF6FF", text: "#1D4ED8", dot: "#3B82F6" },
  Konten:      { bg: "#FDF2F8", text: "#9D174D", dot: "#EC4899" },
  SaaS:        { bg: "#F0FDF4", text: "#166534", dot: "#22C55E" },
  Blackbox:    { bg: "#F0FDF4", text: "#065F46", dot: "#10B981" },
  Claude:      { bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B" },
  Gemini:      { bg: "#EFF6FF", text: "#1E40AF", dot: "#60A5FA" },
  Copywriting: { bg: "#FFF1F2", text: "#9F1239", dot: "#F43F5E" },
  Twitter:     { bg: "#F0F9FF", text: "#075985", dot: "#0EA5E9" },
  Marketing:   { bg: "#FFF7ED", text: "#9A3412", dot: "#F97316" },
};

export const ALL_TAGS = Object.keys(TAG_PALETTE);

export const CATEGORY_LIST = [
  { name: "Semua",        icon: "grid-dots"    },
  { name: "ChatGPT",     icon: "brand-openai"  },
  { name: "Claude",      icon: "sparkles"      },
  { name: "Gemini",      icon: "diamond"       },
  { name: "Copywriting", icon: "pencil"        },
  { name: "Blackbox",    icon: "terminal-2"    },
];