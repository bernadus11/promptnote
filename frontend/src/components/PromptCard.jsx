import { useState } from "react";
import TagPill from "./TagPill";
import Icon from "./Icon";

const CAT_COLOR = {
  ChatGPT: "#3B82F6", Claude: "#F59E0B", Gemini: "#6366F1",
  Copywriting: "#F43F5E", Blackbox: "#10B981",
};

export default function PromptCard({ prompt, onEdit, onDelete }) {
  const [hov, setHov] = useState(false);
  const catColor = CAT_COLOR[prompt.category] || "#8B5CF6";

  return (
    <div
      onClick={() => onEdit(prompt)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff", borderRadius: 14,
        border: hov ? `1.5px solid ${catColor}33` : "1.5px solid #F1F5F9",
        padding: "16px 18px", cursor: "pointer",
        boxShadow: hov
          ? `0 4px 24px ${catColor}14, 0 1px 4px rgba(0,0,0,.04)`
          : "0 1px 4px rgba(0,0,0,.04)",
        transition: "all .18s", position: "relative", overflow: "hidden",
      }}
    >
      {/* Accent bar kiri */}
      <div style={{
        position: "absolute", top: 0, left: 0, width: 3, bottom: 0,
        background: catColor, borderRadius: "4px 0 0 4px",
        opacity: hov ? 1 : 0, transition: "opacity .18s",
      }} />

      {/* Baris atas */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0F172A", lineHeight: 1.4, flex: 1 }}>
          {prompt.starred && <span style={{ color: "#F59E0B", marginRight: 5 }}>★</span>}
          {prompt.title}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, color: catColor,
            background: `${catColor}14`, padding: "2px 8px", borderRadius: 999,
          }}>{prompt.category}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(prompt); }}
            style={{
              width: 28, height: 28, borderRadius: 8, border: "none",
              background: hov ? "#FEF2F2" : "transparent",
              color: hov ? "#EF4444" : "#CBD5E1",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all .15s", flexShrink: 0,
            }}
          >
            <Icon n="trash" size={13} />
          </button>
        </div>
      </div>

      {/* Deskripsi */}
      <p style={{
        margin: "0 0 12px", fontSize: 12, color: "#64748B", lineHeight: 1.6,
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>
        {prompt.description || <span style={{ color: "#CBD5E1" }}>Tidak ada isi prompt.</span>}
      </p>

      {/* Baris bawah */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {prompt.tags.map((t) => <TagPill key={t} tag={t} />)}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#CBD5E1" }}>{prompt.date}</span>
          {hov && (
            <span style={{ fontSize: 11, color: catColor, fontWeight: 600 }}>
              Edit <Icon n="arrow-right" size={11} style={{ color: catColor }} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}