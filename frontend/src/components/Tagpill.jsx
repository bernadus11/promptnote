import { TAG_PALETTE } from "../constants/promptData";

export default function TagPill({ tag, onRemove }) {
  const p = TAG_PALETTE[tag] || { bg: "#F1F5F9", text: "#475569", dot: "#94A3B8" };

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: p.bg, color: p.text,
      fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 999,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: p.dot, flexShrink: 0 }} />
      {tag}
      {onRemove && (
        <button
          onClick={onRemove}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: p.text, opacity: 0.6, fontSize: 12, padding: 0, lineHeight: 1,
          }}
        >×</button>
      )}
    </span>
  );
}