import { useState } from "react";
import { CATEGORY_LIST, ALL_TAGS, TAG_PALETTE } from "../constants/promptData";
import TagPill from "./TagPill";
import Icon from "./Icon";

const inputStyle = {
  width: "100%", boxSizing: "border-box",
  border: "1.5px solid #E5E7EB", borderRadius: 10,
  padding: "10px 14px", fontSize: 13, color: "#0F172A",
  outline: "none", fontFamily: "inherit", background: "#FAFAFA", transition: "border .15s",
};

const labelStyle = {
  display: "block", marginBottom: 6, fontSize: 11, fontWeight: 700,
  color: "#94A3B8", letterSpacing: "0.07em", textTransform: "uppercase",
};

const defaults = {
  title: "", description: "", category: "ChatGPT", tags: [], starred: false,
  date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
};

export default function PromptModal({ prompt, isNew, onSave, onClose }) {
  const [form, setForm]         = useState(prompt ? { ...prompt } : defaults);
  const [tagInput, setTagInput] = useState("");
  const [tagError, setTagError] = useState("");

  const addTag = (tag) => {
    const t = (tag || tagInput).trim();
    if (!t) return;
    if (form.tags.includes(t)) { setTagError("Tag sudah ada"); return; }
    if (form.tags.length >= 4) { setTagError("Maks. 4 tag");  return; }
    setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    setTagInput(""); setTagError("");
  };

  const removeTag  = (t) => setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }));
  const handleSave = () => { if (!form.title.trim()) return; onSave({ ...form, id: form.id || Date.now() }); };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        background: "rgba(15,23,42,.6)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 20, width: "100%", maxWidth: 520,
          boxShadow: "0 24px 64px rgba(0,0,0,.16)", overflowY: "auto", maxHeight: "92vh",
        }}
      >
        <div style={{ height: 3, background: "linear-gradient(90deg,#6D28D9,#4F46E5,#7C3AED)" }} />

        {/* Header */}
        <div style={{ padding: "28px 28px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0F172A" }}>
              {isNew ? "Tambah Prompt Baru" : "Edit Prompt"}
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#94A3B8" }}>
              {isNew ? "Simpan prompt ke koleksimu" : "Perbarui detail prompt"}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8, border: "1px solid #E5E7EB",
              background: "white", display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer",
            }}
          >
            <Icon n="x" size={15} style={{ color: "#94A3B8" }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 28px 0", display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Judul */}
          <div>
            <label style={labelStyle}>Judul Prompt *</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Contoh: Buat caption Instagram viral..."
              style={inputStyle}
            />
          </div>

          {/* Isi */}
          <div>
            <label style={labelStyle}>Isi Prompt</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Tulis isi prompt AI di sini..."
              rows={4}
              style={{ ...inputStyle, resize: "none" }}
            />
          </div>

          {/* Kategori */}
          <div>
            <label style={labelStyle}>Kategori</label>
            <div style={{ position: "relative" }}>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                style={{ ...inputStyle, appearance: "none", paddingRight: 36 }}
              >
                {CATEGORY_LIST.filter((c) => c.name !== "Semua").map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
              <Icon n="chevron-down" size={14} style={{
                position: "absolute", right: 12, top: "50%",
                transform: "translateY(-50%)", color: "#94A3B8", pointerEvents: "none",
              }} />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label style={labelStyle}>Label / Tag</label>
            {form.tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                {form.tags.map((t) => <TagPill key={t} tag={t} onRemove={() => removeTag(t)} />)}
              </div>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
              {ALL_TAGS.filter((t) => !form.tags.includes(t)).map((t) => {
                const p = TAG_PALETTE[t];
                return (
                  <button
                    key={t}
                    onClick={() => addTag(t)}
                    style={{
                      fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 999,
                      background: p.bg, color: p.text, border: "none", cursor: "pointer", opacity: 0.8,
                    }}
                  >+ {t}</button>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={tagInput}
                onChange={(e) => { setTagInput(e.target.value); setTagError(""); }}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
                placeholder="Tag kustom, tekan Enter…"
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                onClick={() => addTag()}
                style={{
                  padding: "10px 16px", borderRadius: 10, border: "none",
                  background: "#EDE9FE", color: "#6D28D9", fontWeight: 700, fontSize: 12, cursor: "pointer",
                }}
              >+ Tambah</button>
            </div>
            {tagError && <p style={{ margin: "6px 0 0", fontSize: 11, color: "#EF4444" }}>{tagError}</p>}
          </div>

          {/* Starred toggle */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: "12px 16px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon n="star" size={18} style={{ color: "#F59E0B" }} />
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#0F172A" }}>Tandai Favorit</p>
                <p style={{ margin: 0, fontSize: 11, color: "#92400E" }}>Prompt dipin di bagian atas</p>
              </div>
            </div>
            <button
              onClick={() => setForm((f) => ({ ...f, starred: !f.starred }))}
              style={{
                width: 44, height: 24, borderRadius: 999, border: "none", cursor: "pointer",
                background: form.starred ? "#F59E0B" : "#E5E7EB",
                position: "relative", transition: "background .2s",
              }}
            >
              <span style={{
                position: "absolute", top: 2, left: form.starred ? 22 : 2,
                width: 20, height: 20, borderRadius: "50%", background: "#fff",
                boxShadow: "0 1px 4px rgba(0,0,0,.18)", transition: "left .2s",
              }} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "20px 28px 28px", display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "12px 0", borderRadius: 10, border: "1.5px solid #E5E7EB",
              background: "white", color: "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer",
            }}
          >Batal</button>
          <button
            onClick={handleSave}
            disabled={!form.title.trim()}
            style={{
              flex: 1, padding: "12px 0", borderRadius: 10, border: "none",
              background: form.title.trim() ? "linear-gradient(135deg,#6D28D9,#4F46E5)" : "#E5E7EB",
              color: form.title.trim() ? "#fff" : "#9CA3AF",
              fontWeight: 700, fontSize: 13,
              cursor: form.title.trim() ? "pointer" : "not-allowed",
              boxShadow: form.title.trim() ? "0 4px 16px rgba(109,40,217,.30)" : "none",
            }}
          >{isNew ? "Simpan Prompt" : "Perbarui"}</button>
        </div>
      </div>
    </div>
  );
}