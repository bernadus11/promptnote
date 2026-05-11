import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

import { CATEGORY_LIST } from "../constants/promptData";
import Navbar       from "../components/Navbar";
import Footer       from "../components/Footer";
import Icon         from "../components/Icon";
import PromptCard   from "../components/PromptCard";
import PromptModal  from "../components/PromptModal";
import DeleteModal  from "../components/DeleteModal";
import EmptyState   from "../components/EmptyState";
import EmptyState   from "../components/TagPill";


export default function Fituroption() {
  const [prompts, setPrompts]               = useState([]);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [search, setSearch]                 = useState("");
  const [showModal, setShowModal]           = useState(false);
  const [editingPrompt, setEditingPrompt]   = useState(null);
  const [isNew, setIsNew]                   = useState(false);
  const [deleteTarget, setDeleteTarget]     = useState(null);
  const [toast, setToast]                   = useState(null);
  const [user, setUser]                     = useState(null);
  const [loading, setLoading]               = useState(true);
  const navigate = useNavigate();

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2600);
  };

  /* ── Load session + prompts ── */
  useEffect(() => {
    const loadUserPrompts = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data?.session?.user;
      if (!sessionUser) { navigate("/Login"); return; }
      setUser(sessionUser);

      const { data: rows, error } = await supabase
        .from("prompts")
        .select("*")
        .eq("user_id", sessionUser.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase fetch error:", error.message);
        showToast("Gagal memuat prompt. Periksa koneksi atau konfigurasi Supabase.", "err");
      } else {
        setPrompts(rows ?? []);
      }
      setLoading(false);
    };
    loadUserPrompts();
  }, [navigate]);

  /* ── Counts per category ── */
  const counts = CATEGORY_LIST.reduce((acc, c) => {
    acc[c.name] = c.name === "Semua"
      ? prompts.length
      : prompts.filter((p) => p.category === c.name).length;
    return acc;
  }, {});

  /* ── Filter + sort ── */
  const filtered = prompts.filter((p) => {
    const catOk    = activeCategory === "Semua" || p.category === activeCategory;
    const q        = search.toLowerCase();
    const searchOk = !q
      || p.title.toLowerCase().includes(q)
      || p.description.toLowerCase().includes(q)
      || p.tags.some((t) => t.toLowerCase().includes(q));
    return catOk && searchOk;
  });
  const sorted = [...filtered].sort((a, b) => (b.starred ? 1 : 0) - (a.starred ? 1 : 0));

  /* ── CRUD handlers ── */
  const handleAdd  = () => { setEditingPrompt(null); setIsNew(true);  setShowModal(true); };
  const handleEdit = (p) => { setEditingPrompt(p);   setIsNew(false); setShowModal(true); };

  const handleSave = async (data) => {
    if (!user) { showToast("Anda harus login terlebih dahulu.", "err"); return; }

    const payload = {
      title: data.title, description: data.description,
      category: data.category, tags: data.tags,
      starred: data.starred, date: data.date,
      user_id: user.id,
      created_at: data.created_at || new Date().toISOString(),
    };

    if (isNew) {
      const { data: inserted, error } = await supabase
        .from("prompts").insert([payload]).select().single();
      if (error) { console.error(error); showToast("Gagal menambahkan prompt.", "err"); return; }
      setPrompts((prev) => [inserted, ...prev]);
      showToast("Prompt berhasil ditambahkan!");
    } else {
      const { data: updated, error } = await supabase
        .from("prompts").update(payload).eq("id", data.id).select().single();
      if (error) { console.error(error); showToast("Gagal memperbarui prompt.", "err"); return; }
      setPrompts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      showToast("Prompt diperbarui!");
    }
    setShowModal(false);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from("prompts").delete().eq("id", deleteTarget.id);
    if (error) { console.error(error); showToast("Gagal menghapus prompt.", "err"); return; }
    setPrompts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    showToast("Prompt dihapus.", "err");
    setDeleteTarget(null);
  };

  /* ── RENDER ── */
  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Plus Jakarta Sans', 'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        input, textarea, select, button { font-family: inherit; }
        input:focus, textarea:focus, select:focus { border-color: #7C3AED !important; outline: none; background: #fff !important; }
        @keyframes toastIn { from { opacity:0; transform:translateY(12px) scale(.96); } to { opacity:1; transform:translateY(0) scale(1); } }
        .cat-btn { transition: all .15s; }
        .cat-btn:hover { background: #EDE9FE !important; color: #6D28D9 !important; }
      `}</style>

      <Navbar user={user} />

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 400,
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 18px", borderRadius: 12,
          background: toast.type === "err" ? "#EF4444" : "#4F46E5",
          color: "#fff", fontSize: 13, fontWeight: 600,
          boxShadow: "0 8px 24px rgba(0,0,0,.16)", animation: "toastIn .3s ease",
        }}>
          <Icon n={toast.type === "err" ? "trash" : "check"} size={15} style={{ color: "#fff" }} />
          {toast.msg}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <PromptModal
          prompt={editingPrompt} isNew={isNew}
          onSave={handleSave} onClose={() => setShowModal(false)}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          prompt={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* ── Hero Banner ── */}
      <div style={{ padding: "80px 24px 0" }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          background: "linear-gradient(135deg,#1E1B4B 0%,#312E81 40%,#4C1D95 100%)",
          borderRadius: 24, padding: "36px 40px",
          display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "space-between", gap: 24,
        }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.15)",
              borderRadius: 999, padding: "5px 14px", marginBottom: 14,
            }}>
              <Icon n="sparkles" size={12} style={{ color: "#C4B5FD" }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#C4B5FD", letterSpacing: ".06em", textTransform: "uppercase" }}>
                Dashboard Prompt AI
              </span>
            </div>
            <h1 style={{ margin: "0 0 8px", fontSize: 34, fontWeight: 800, color: "#fff", letterSpacing: "-0.8px" }}>
              Koleksi Prompt Saya
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: "#A5B4FC" }}>
              {loading
                ? "Memuat prompt Anda..."
                : `${prompts.length} prompt tersimpan · ${prompts.filter((p) => p.starred).length} favorit`}
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            {[
              { label: "Total Prompt", value: prompts.length,                          icon: "file-text" },
              { label: "Favorit",      value: prompts.filter((p) => p.starred).length, icon: "star"      },
            ].map((s) => (
              <div key={s.label} style={{
                background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)",
                borderRadius: 16, padding: "16px 24px", minWidth: 120,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <Icon n={s.icon} size={13} style={{ color: "#A5B4FC" }} />
                  <span style={{ fontSize: 11, color: "#A5B4FC", fontWeight: 500 }}>{s.label}</span>
                </div>
                <p style={{ margin: 0, fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: "-1px" }}>
                  {s.value}
                </p>
              </div>
            ))}
            <button
              onClick={handleAdd}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "#fff", color: "#4F46E5", fontWeight: 700, fontSize: 13,
                padding: "14px 22px", borderRadius: 14, border: "none", cursor: "pointer",
                boxShadow: "0 4px 20px rgba(0,0,0,.2)", whiteSpace: "nowrap",
              }}
            >
              <Icon n="plus" size={15} style={{ color: "#4F46E5" }} /> Tambah Prompt
            </button>
          </div>
        </div>
      </div>

      {/* ── Body: Sidebar + Main ── */}
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        padding: "24px 24px 0",
        display: "flex", gap: 20, alignItems: "flex-start",
      }}>

        {/* Sidebar */}
        <aside style={{
          width: 220, flexShrink: 0,
          background: "#fff", borderRadius: 18, border: "1px solid #F1F5F9",
          padding: "20px 14px", position: "sticky", top: 76,
        }}>
          <p style={{ margin: "0 0 12px 6px", fontSize: 10, fontWeight: 700, color: "#CBD5E1", letterSpacing: ".08em", textTransform: "uppercase" }}>
            Tipe Prompt
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {CATEGORY_LIST.map((cat) => {
              const active = activeCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  className="cat-btn"
                  onClick={() => setActiveCategory(cat.name)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "9px 12px", borderRadius: 10, border: "none",
                    background: active ? "linear-gradient(135deg,#6D28D9,#4F46E5)" : "transparent",
                    color: active ? "#fff" : "#64748B",
                    fontWeight: active ? 700 : 500, fontSize: 13, cursor: "pointer",
                    boxShadow: active ? "0 2px 10px rgba(109,40,217,.22)" : "none",
                    textAlign: "left",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon n={cat.icon} size={15} style={{ color: active ? "#C4B5FD" : "#94A3B8" }} />
                    {cat.name}
                  </span>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "1px 8px", borderRadius: 999,
                    background: active ? "rgba(255,255,255,.2)" : "#F1F5F9",
                    color: active ? "#fff" : "#94A3B8",
                  }}>{counts[cat.name] ?? 0}</span>
                </button>
              );
            })}
          </div>

          {/* Ringkasan */}
          <div style={{ margin: "20px 0 0", borderTop: "1px solid #F1F5F9", paddingTop: 16 }}>
            <p style={{ margin: "0 0 10px 6px", fontSize: 10, fontWeight: 700, color: "#CBD5E1", letterSpacing: ".08em", textTransform: "uppercase" }}>
              Ringkasan
            </p>
            {[
              { label: "Total",    value: prompts.length },
              { label: "Favorit",  value: prompts.filter((p) => p.starred).length },
              { label: "Kategori", value: CATEGORY_LIST.length - 1 },
            ].map((s) => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 6px", fontSize: 12 }}>
                <span style={{ color: "#94A3B8" }}>{s.label}</span>
                <span style={{ color: "#0F172A", fontWeight: 700 }}>{s.value}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, minWidth: 0 }}>

          {/* Search bar */}
          <div style={{ position: "relative", marginBottom: 16 }}>
            <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>
              <Icon n="search" size={15} style={{ color: "#94A3B8" }} />
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari prompt berdasarkan judul, isi, atau tag..."
              style={{
                width: "100%", padding: "12px 40px 12px 40px",
                border: "1.5px solid #E5E7EB", borderRadius: 12,
                fontSize: 13, color: "#0F172A", background: "#fff",
                outline: "none", boxShadow: "0 1px 4px rgba(0,0,0,.04)",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  width: 22, height: 22, borderRadius: "50%", border: "none",
                  background: "#E5E7EB", display: "flex", alignItems: "center",
                  justifyContent: "center", cursor: "pointer",
                }}
              >
                <Icon n="x" size={12} style={{ color: "#94A3B8" }} />
              </button>
            )}
          </div>

          {/* Section header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>
                {activeCategory === "Semua" ? "Semua Prompt" : activeCategory}
              </span>
              <span style={{ marginLeft: 8, fontSize: 12, color: "#94A3B8" }}>
                {sorted.length} prompt
              </span>
            </div>
            {sorted.length > 0 && (
              <button
                onClick={handleAdd}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 14px", borderRadius: 9, border: "1.5px solid #E5E7EB",
                  background: "white", color: "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer",
                }}
              >
                <Icon n="plus" size={13} style={{ color: "#6D28D9" }} /> Tambah
              </button>
            )}
          </div>

          {/* Prompt list */}
          {sorted.length === 0
            ? <EmptyState onAdd={handleAdd} />
            : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {sorted.map((p) => (
                  <PromptCard key={p.id} prompt={p} onEdit={handleEdit} onDelete={setDeleteTarget} />
                ))}
              </div>
            )
          }
        </main>
      </div>

      <Footer />
    </div>
  );
}