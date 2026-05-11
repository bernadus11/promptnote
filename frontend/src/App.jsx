import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
const prompts = [
  {
    title: "Buat ide konten Instagram tentang produktivitas",
    desc: "Berikan 10 ide konten instagram carousel tentang produktivitas untuk pekerja kantoran...",
    tags: ["ChatGPT", "Konten"],
    date: "20 Mei 2024",
    starred: true,
  },
  {
    title: "Prompt untuk membuat landing page SaaS",
    desc: "Buat struktur dan copy landing page untuk aplikasi SaaS manajemen tugas yang modern...",
    tags: ["ChatGPT", "SaaS"],
    date: "18 Mei 2024",
    starred: true,
  },
  {
    title: "Jelaskan konsep Async/Await di JavaScript",
    desc: "Jelaskan secara sederhana konsep Async/Await di JavaScript untuk pemula dengan contoh kode...",
    tags: ["Coding"],
    date: "17 Mei 2024",
    starred: false,
  },
];
 
const categories = [
  { name: "Semua", count: 24, icon: "⊞" },
  { name: "ChatGPT", count: 12, icon: "✦" },
  { name: "Midjourney", count: 6, icon: "◈" },
  { name: "Gemini", count: 3, icon: "◇" },
  { name: "Copywriting", count: 8, icon: "✎" },
  { name: "Coding", count: 5, icon: "⌨" },
];
 
const stats = [
  { value: "100%", label: "Aman dan Terpercaya", icon: "🔒" },
  { value: "Easy", label: "Simpel dan Praktis", icon: "✨" },
  { value: "99%", label: "Kepuasan Pengguna", icon: "😊" },
  { value: "24/7", label: "Akses Tanpa Batas", icon: "⚡" },
];
const tagColors = {
  ChatGPT: "bg-violet-100 text-violet-700",
  Konten: "bg-pink-100 text-pink-700",
  SaaS: "bg-blue-100 text-blue-700",
  Coding: "bg-green-100 text-green-700",
  Midjourney: "bg-amber-100 text-amber-700",
  Gemini: "bg-sky-100 text-sky-700",
};
 
const appScreens = [
  { label: "Dashboard Prompt", description: "Kelola semua prompt dalam satu tampilan yang rapi dan terorganisir" },
  { label: "Pencarian Cepat", description: "Temukan prompt yang kamu butuhkan dalam hitungan detik" },
  { label: "Tambah & Edit Prompt", description: "Simpan prompt baru dengan mudah dan tandai yang paling favorit" },
];
 
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}
 
function AnimatedSection({ children, className = "", delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={className} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(32px)", transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}>
      {children}
    </div>
  );
}
 
// ── APP PREVIEW ───────────────────────────────────────────────────────────────
function AppPreviewMockup({ activeCategory, setActiveCategory }) {
  const [activeScreen, setActiveScreen] = useState(0);
  return (
    <div className="relative">
      <div className="flex gap-2 mb-5 justify-center flex-wrap">
        {appScreens.map((s, i) => (
          <button key={i} onClick={() => setActiveScreen(i)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${activeScreen === i ? "bg-violet-600 text-white border-violet-600 shadow" : "bg-white text-gray-500 border-gray-200 hover:border-violet-300 hover:text-violet-600"}`}>
            {s.label}
          </button>
        ))}
      </div>
 
      <div className="rounded-2xl overflow-hidden border border-gray-200" style={{ boxShadow: "0 8px 48px rgba(109,40,217,0.14), 0 2px 8px rgba(0,0,0,0.06)" }}>
        {/* Browser bar */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-1 flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth={2} className="w-3 h-3 flex-shrink-0"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            <span className="text-gray-400 text-xs">app.promptnote.id/dashboard</span>
          </div>
          <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" /></svg>
          </div>
        </div>
 
        {/* Screen 0 — Dashboard */}
        {activeScreen === 0 && (
          <div className="flex bg-white" style={{ minHeight: 360 }}>
            <div className="w-36 border-r border-gray-100 p-3 bg-gray-50/60 flex-shrink-0">
              <div className="flex items-center gap-1.5 mb-4">
                <div className="w-5 h-5 rounded-md bg-violet-600 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" /></svg>
                </div>
                <span className="font-bold text-gray-800 text-xs">PromptNote</span>
              </div>
              <p className="text-gray-400 text-[9px] font-bold uppercase tracking-wider mb-2">Tipe Prompt</p>
              <div className="space-y-0.5">
                {categories.map((cat) => (
                  <button key={cat.name} onClick={() => setActiveCategory(cat.name)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${activeCategory === cat.name ? "bg-violet-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                    <span className="flex items-center gap-1"><span className="text-[9px]">{cat.icon}</span>{cat.name}</span>
                    <span className={`text-[9px] ${activeCategory === cat.name ? "text-violet-200" : "text-gray-400"}`}>{cat.count}</span>
                  </button>
                ))}
                <button className="w-full flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] text-violet-600 font-bold hover:bg-violet-50 mt-1.5">+ Tambah Tipe</button>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-gray-900 font-bold text-sm">Semua Prompt</p>
                  <p className="text-gray-400 text-xs">24 prompt tersimpan</p>
                </div>
                <button className="flex items-center gap-1 bg-violet-600 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg">+ Tambah Prompt</button>
              </div>
              <div className="space-y-2.5">
                {prompts.map((p, i) => (
                  <div key={i} className="p-3 rounded-xl border border-gray-100 bg-white cursor-pointer hover:border-violet-200 hover:shadow-md transition-all" style={{ boxShadow: "0 1px 8px rgba(109,40,217,0.06)" }}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-gray-900 text-xs font-bold leading-tight">{p.title}</p>
                      <svg viewBox="0 0 24 24" className={`w-3.5 h-3.5 flex-shrink-0 ${p.starred ? "fill-amber-400 stroke-amber-400" : "fill-none stroke-gray-300"}`} strokeWidth={2}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    </div>
                    <p className="text-gray-400 text-[10px] leading-relaxed mb-2" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.desc}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">{p.tags.map((t) => (<span key={t} className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${tagColors[t] || "bg-gray-100 text-gray-600"}`}>{t}</span>))}</div>
                      <span className="text-gray-300 text-[9px]">{p.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
 
        {/* Screen 1 — Search */}
        {activeScreen === 1 && (
          <div className="bg-white p-6" style={{ minHeight: 360 }}>
            <div className="mb-4">
              <div className="flex items-center gap-3 bg-violet-50 border-2 border-violet-300 rounded-xl px-4 py-3 mb-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth={2.5} className="w-5 h-5 flex-shrink-0"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                <span className="text-violet-700 font-semibold text-sm">instagram konten viral</span>
                <span className="ml-auto text-xs bg-violet-600 text-white px-2 py-0.5 rounded-full font-bold">Cari</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {["Semua", "ChatGPT", "Konten", "Viral"].map((t, i) => (
                  <span key={t} className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${i === 0 ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600"}`}>{t}</span>
                ))}
              </div>
            </div>
            <p className="text-gray-400 text-xs mb-3 font-medium">Ditemukan 3 hasil untuk "instagram konten viral"</p>
            <div className="space-y-2">
              {prompts.slice(0, 2).map((p, i) => (
                <div key={i} className="p-3 rounded-xl border border-gray-100 bg-white hover:border-violet-200 transition-all cursor-pointer" style={{ boxShadow: "0 1px 8px rgba(109,40,217,0.06)" }}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-gray-900 text-xs font-bold leading-tight">{p.title}</p>
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 flex-shrink-0 fill-amber-400 stroke-amber-400" strokeWidth={2}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  </div>
                  <p className="text-gray-400 text-[10px] leading-relaxed mb-2">{p.desc}</p>
                  <div className="flex gap-1">{p.tags.map((t) => (<span key={t} className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${tagColors[t] || "bg-gray-100 text-gray-600"}`}>{t}</span>))}</div>
                </div>
              ))}
              <div className="p-3 rounded-xl border-2 border-violet-300 bg-violet-50 cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-bold bg-violet-600 text-white px-1.5 py-0.5 rounded-full">COCOK</span>
                  <p className="text-violet-800 text-xs font-bold">10 Ide Konten Viral Instagram 2024</p>
                </div>
                <p className="text-violet-600 text-[10px]">Konten reels, carousel, dan stories yang terbukti viral di Instagram...</p>
              </div>
            </div>
          </div>
        )}
 
        {/* Screen 2 — Add/Edit */}
        {activeScreen === 2 && (
          <div className="bg-white p-6" style={{ minHeight: 360 }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-extrabold text-gray-900 text-sm">✦ Tambah Prompt Baru</h3>
              <div className="flex gap-2">
                <button className="text-xs font-semibold text-gray-400 px-3 py-1.5 rounded-lg border border-gray-200">Batal</button>
                <button className="text-xs font-bold text-white bg-violet-600 px-3 py-1.5 rounded-lg">Simpan</button>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wide block mb-1">Judul Prompt</label>
                <div className="border-2 border-violet-300 rounded-xl px-3 py-2.5 bg-violet-50/40"><p className="text-gray-900 text-xs font-semibold">Buat thread Twitter tentang tips produktivitas</p></div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wide block mb-1">Isi Prompt</label>
                <div className="border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50/60" style={{ minHeight: 80 }}>
                  <p className="text-gray-600 text-[10px] leading-relaxed">Buatkan 10 tweet thread yang engaging tentang tips produktivitas untuk developer. Gunakan gaya yang informatif, tambahkan emoji, dan pastikan setiap tweet berkaitan...</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wide block mb-1">Tipe</label>
                  <div className="border border-gray-200 rounded-xl px-3 py-2 bg-white flex items-center justify-between">
                    <span className="text-gray-700 text-xs font-semibold">ChatGPT</span>
                    <span className="text-gray-400 text-xs">▾</span>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wide block mb-1">Label</label>
                  <div className="flex gap-1 flex-wrap">
                    {["Twitter", "Konten"].map((t) => (<span key={t} className="text-[9px] font-bold px-2 py-1 rounded-full bg-pink-100 text-pink-700">{t} ×</span>))}
                    <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-gray-100 text-violet-600 cursor-pointer">+ Tambah</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <div className="w-8 h-4 bg-violet-600 rounded-full relative flex-shrink-0">
                  <div className="w-3 h-3 bg-white rounded-full absolute top-0.5 right-0.5" />
                </div>
                <span className="text-xs text-gray-600 font-medium">Tandai sebagai favorit ⭐</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default function App() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [scrolled, setScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();
  const isLoggedIn = Boolean(user);
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  
  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setAuthLoading(false);
    };
    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);

    return () => {
      authListener?.subscription?.unsubscribe();
      window.removeEventListener("scroll", handler);
    };
  }, []);

  const handleFiturClick = (e) => {
    e?.preventDefault();
    if (!isLoggedIn) setShowLoginModal(true);
    else navigate("/Fituroption");
  };

  const handlePromptLabClick = (e) => {
    e?.preventDefault();
    if (!isLoggedIn) setShowLoginModal(true);
    else navigate("/Fituroption");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Plus Jakarta Sans', 'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .hero-gradient{background:radial-gradient(ellipse 80% 60% at 60% 30%,#ede9fe 0%,#f5f3ff 40%,#ffffff 100%)}
        .card-shadow{box-shadow:0 2px 24px rgba(109,40,217,.08),0 1px 4px rgba(0,0,0,.04)}
        .btn-glow{box-shadow:0 4px 24px rgba(109,40,217,.35)}
        .nav-blur{backdrop-filter:blur(16px);background:rgba(255,255,255,.88)}
        .float-anim{animation:float 4s ease-in-out infinite}
        .float-anim-2{animation:float 5s ease-in-out infinite 1s}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        .stat-card{background:linear-gradient(135deg,#f5f3ff 0%,#ede9fe 100%)}
        .mesh-bg{background:radial-gradient(circle at 20% 50%,#ede9fe 0%,transparent 60%),radial-gradient(circle at 80% 80%,#dbeafe 0%,transparent 50%),#f8fafc}
        .modal-in{animation:mIn .28s cubic-bezier(.34,1.56,.64,1) forwards}
        @keyframes mIn{from{opacity:0;transform:scale(.88) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
      `}</style>
 
      {/* ── LOGIN MODAL ── */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(15,10,40,.55)", backdropFilter: "blur(6px)" }}
          onClick={() => setShowLoginModal(false)}>
          <div className="modal-in relative bg-white rounded-3xl w-full max-w-sm overflow-hidden"
            style={{ boxShadow: "0 24px 80px rgba(109,40,217,.22),0 2px 8px rgba(0,0,0,.08)" }}
            onClick={(e) => e.stopPropagation()}>
 
            {/* accent */}
            <div className="h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />
 
            {/* close */}
            <button onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 text-gray-500"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
 
            <div className="px-8 py-8 text-center">
              {/* lock icon */}
              <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth={2} className="w-8 h-8">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
 
              <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 mb-3">
                <span className="text-amber-500 text-xs">⚠</span>
                <span className="text-amber-700 text-xs font-bold">Login Diperlukan</span>
              </div>
 
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">Harap Login Akun Dulu</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-7">
                Fitur aplikasi PromptNote hanya dapat diakses oleh pengguna yang sudah memiliki akun.{" "}
                <span className="text-violet-600 font-semibold">Login atau daftar gratis</span> untuk melanjutkan.
              </p>
 
              <div className="flex flex-col gap-3">
                <button onClick={() => { setShowLoginModal(false); navigate('/Login'); }}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-extrabold py-3.5 rounded-xl text-sm transition-all"
                  style={{ boxShadow: "0 4px 20px rgba(109,40,217,.35)" }}>
                   Masuk ke Akun
                </button>
                <button onClick={() => { setShowLoginModal(false); navigate('/Register'); }}
                  className="w-full border-2 border-violet-200 text-violet-700 hover:bg-violet-50 font-extrabold py-3.5 rounded-xl text-sm transition-all">
                  Daftar Gratis — Gratis Selamanya
                </button>
                <button onClick={() => setShowLoginModal(false)} className="text-gray-400 hover:text-gray-600 text-sm font-medium mt-1 transition-colors">
                  Kembali ke Beranda
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
 
      {/* ── NAVBAR ── */}
<nav
  className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    scrolled
      ? "bg-white/80 backdrop-blur-md shadow-sm"
      : "bg-transparent"
  }`}
>
  <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

    {/* Logo */}
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
        </svg>
      </div>

      <span className="font-extrabold text-gray-900 text-lg tracking-tight">
        PromptNote
      </span>
    </div>

    {/* Menu + Auth jadi sejajar */}
    <div className="hidden md:flex items-center gap-4">

      {/* Menu */}
        <a
          href="#beranda"
          className="text-zinc-900 font-bold text-sm hover:border-b-2 hover:border-violet-500 pb-0.5 transform transition-transform duration-500"
        >
          Beranda
        </a>
        <a
          href="#about"
          className="text-zinc-900 font-bold text-sm hover:border-b-2 hover:border-violet-500 pb-0.5 transform transition-transform duration-500"
        >
          About
        </a>
        <a
          href="#info"
          className="text-zinc-900 font-bold text-sm hover:border-b-2 hover:border-violet-500 pb-0.5 transform transition-transform duration-500"
        >
          Info
        </a>
        <a
          href="/Fituroption"
          onClick={handlePromptLabClick}
          className="text-violet-700 font-bold text-sm hover:border-b-2 hover:border-violet-500 pb-0.5 transform transition-transform duration-500"
        >
          PromptLab
        </a>

        {/* Divider */}
      <div className="w-px h-6 bg-gray-200 mx-1"></div>

      {/* Auth */}
      {isLoggedIn ? (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-semibold text-gray-900">{userName}</span>
          <button onClick={handleLogout} className="text-sm font-semibold text-gray-700 hover:text-violet-700 px-4 py-2 rounded-lg hover:bg-violet-50 transition-all border border-gray-200">
            Logout
          </button>
        </div>
      ) : (
        <>
          <a href="/Login" className="text-sm font-semibold text-gray-700 hover:text-violet-700 px-4 py-2 rounded-lg hover:bg-violet-50 transition-all border border-gray-200">
            Login
          </a>

          <a href="/Register" className="text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 px-5 py-2.5 rounded-xl btn-glow transition-all">
            Register
          </a>
        </>
      )}
    </div>
  </div>
</nav>
 
      {/* ── HERO ── */}
      <section className="hero-gradient pt-28 pb-20 overflow-hidden" id="beranda">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white border border-violet-200 rounded-full px-4 py-1.5 mb-6 card-shadow">
                <span className="text-violet-500 text-sm">✦</span>
                <span className="text-violet-700 font-semibold text-sm">Catatan Prompt AI Modern</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-5">
                Catat, Simpan,<br />
                <span className="text-violet-600">dan Temukan</span><br />
                Prompt AI
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
                Simpan semua prompt AI favorit Anda dengan aman dan temukan kembali dengan cepat kapan saja. Produktivitas meningkat, ide tidak akan hilang.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
                <button className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-7 py-3.5 rounded-xl btn-glow transition-all text-base">
                  Mulai Gratis Sekarang
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
                <button onClick={handleFiturClick}
                  className="flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 font-bold px-7 py-3.5 rounded-xl hover:border-violet-300 hover:text-violet-700 transition-all text-base bg-white">
                  <div className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                  Lihat Fitur
                </button>
              </div>
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {["violet", "pink", "indigo"].map((c, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-${c}-400 flex items-center justify-center text-white text-xs font-bold`}>{["A","B","C"][i]}</div>
                  ))}
                </div>
                <div className="flex">{[...Array(5)].map((_, i) => <span key={i} className="text-amber-400 text-sm">★</span>)}</div>
                <span className="text-gray-500 text-sm font-medium">Dipercaya ribuan pengguna produktif</span>
              </div>
            </div>
 
            {/* Hero mockup */}
            <div className="flex-1 relative">
              <div className="float-anim relative z-10">
                <div className="bg-white rounded-2xl card-shadow border border-gray-100 overflow-hidden w-full max-w-md mx-auto">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" /></svg>
                      </div>
                      <span className="font-bold text-gray-900 text-sm">PromptNote</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 flex-1 mx-3 border border-gray-200">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth={2} className="w-3.5 h-3.5 flex-shrink-0"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                      <span className="text-gray-400 text-xs">Cari prompt...</span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center">
                      <span className="text-violet-600 text-xs font-bold">A</span>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-32 border-r border-gray-100 p-3">
                      <p className="text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">Tipe Prompt</p>
                      <div className="space-y-0.5">
                        {categories.map((cat) => (
                          <button key={cat.name} onClick={() => setActiveCategory(cat.name)}
                            className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${activeCategory === cat.name ? "bg-violet-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}>
                            <span className="flex items-center gap-1.5"><span className="text-[10px]">{cat.icon}</span>{cat.name}</span>
                            <span className={`text-[10px] font-semibold ${activeCategory === cat.name ? "text-violet-200" : "text-gray-400"}`}>{cat.count}</span>
                          </button>
                        ))}
                        <button className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs text-violet-600 font-semibold hover:bg-violet-50 mt-2">+ Tambah Tipe</button>
                      </div>
                    </div>
                    <div className="flex-1 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-900 text-xs font-bold">Semua Prompt</p>
                        <button className="flex items-center gap-1 bg-violet-600 text-white text-[10px] font-bold px-2 py-1 rounded-md">+ Tambah</button>
                      </div>
                      <div className="space-y-2">
                        {prompts.map((p, i) => (
                          <div key={i} className="p-2.5 rounded-xl border border-gray-100 bg-white card-shadow cursor-pointer hover:border-violet-200 transition-all">
                            <div className="flex items-start justify-between gap-1 mb-1">
                              <p className="text-gray-900 text-[11px] font-semibold leading-tight" style={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.title}</p>
                              <svg viewBox="0 0 24 24" className={`w-3.5 h-3.5 flex-shrink-0 ${p.starred ? "fill-amber-400 stroke-amber-400" : "fill-none stroke-gray-300"}`} strokeWidth={2}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                            </div>
                            <p className="text-gray-400 text-[10px] leading-relaxed mb-1.5" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.desc}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex gap-1 flex-wrap">{p.tags.map((t) => (<span key={t} className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${tagColors[t] || "bg-gray-100 text-gray-600"}`}>{t}</span>))}</div>
                              <span className="text-gray-300 text-[9px]">{p.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="float-anim-2 absolute -top-4 -right-4 w-14 h-14 bg-white rounded-2xl card-shadow flex items-center justify-center z-20"><span className="text-2xl">⭐</span></div>
              <div className="float-anim absolute bottom-8 -left-6 w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center z-20 shadow-lg">
                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" stroke="white" strokeWidth="2" fill="none" /></svg>
              </div>
              <div className="absolute -bottom-4 right-10 w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center z-20 shadow-lg float-anim-2"><span className="text-white font-bold text-sm">✦</span></div>
            </div>
          </div>
        </div>
      </section>
 
      {/* ── FITUR — APP PREVIEW SCREENSHOT ── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-full px-4 py-1.5 mb-4">
              <span className="text-violet-500 text-sm">⊞</span>
              <span className="text-violet-700 font-semibold text-sm uppercase tracking-wide">Fitur Unggulan</span>
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-3">Semua yang Anda Butuhkan</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto mb-2">Dirancang untuk membantu Anda mengelola prompt AI dengan mudah dan efisien.</p>
            <p className="text-gray-400 text-sm">
              Untuk akses penuh fitur aplikasi,{" "}
              <button onClick={handleFiturClick} className="text-violet-600 font-bold hover:underline">login atau daftar akun gratis →</button>
            </p>
          </AnimatedSection>
 
          {/* Interactive app screenshot */}
          <AnimatedSection delay={0.1}>
            <AppPreviewMockup activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
          </AnimatedSection>
 
          {/* 4 mini highlight chips */}
        </div>
      </section>
 
      {/* ── WHY ── */}
      <section className="py-24 mesh-bg" id="about">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <AnimatedSection className="flex-1">
              <div className="relative">
                <img src="/assets/ai.jpeg" alt="image-description" className="rounded-2xl float-anim" />
              </div>
            </AnimatedSection>
            <div className="flex-1">
              <AnimatedSection>
                <div className="inline-flex items-center gap-2 bg-white border border-violet-200 rounded-full px-4 py-1.5 mb-4 card-shadow">
                  <span className="text-violet-700 font-semibold text-sm uppercase tracking-wide">Kenapa PromptNote?</span>
                </div>
                <h2 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">Jangan Biarkan Prompt<br />Bagus Hilang Lagi</h2>
                <p className="text-gray-500 text-lg mb-8 leading-relaxed">Banyak prompt berharga hilang tertimbun di chat atau catatan lain. PromptNote hadir untuk menjadi rumah terbaik bagi semua prompt AI Anda.</p>
                <div className="space-y-3 mb-8">
                  {["Simpan tanpa batas", "Temukan dengan mudah", "Tingkatkan produktivitas harian"].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" fill="none" /></svg>
                      </div>
                      <span className="text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
              <AnimatedSection delay={0.2}>
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((s, i) => (
                    <div key={i} className="stat-card rounded-2xl p-4 text-center border border-violet-100">
                      <div className="text-2xl mb-1">{s.icon}</div>
                      <div className="text-2xl font-extrabold text-violet-700">{s.value}</div>
                      <div className="text-gray-500 text-sm">{s.label}</div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
 
      {/* ── WEB SERVICES ── */}
     <section className="py-24 bg-white" id="info">
  <div className="max-w-6xl mx-auto px-6">

    {/* ── HEADER ── */}
    <AnimatedSection className="text-center mb-14">
      <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 mb-6">
        <span className="text-amber-500 text-sm">💡</span>
        <span className="text-amber-700 font-bold text-xs uppercase tracking-widest">Punya Ide Website?</span>
      </div>

      <h2 className="text-5xl font-black text-gray-900 leading-tight mb-4">
        Kami Bantu Wujudkan<br />
        <span className="text-violet-600">Website Impian Anda</span>
      </h2>

      <p className="text-gray-500 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
        Selain PromptNote, kami juga menyediakan jasa pembuatan website modern, cepat, dan sesuai kebutuhan bisnis Anda.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        {["Landing Page", "SaaS Application", "E-commerce", "Portfolio Website"].map((s) => (
          <div key={s} className="flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-full px-4 py-2">
            <div className="w-4 h-4 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} className="w-2.5 h-2.5"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <span className="text-violet-700 text-sm font-semibold">{s}</span>
          </div>
        ))}
      </div>
    </AnimatedSection>

    {/* ── DIVIDER ── */}
    <AnimatedSection delay={0.05} className="flex items-center gap-4 mb-10">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-xs font-bold text-gray-400 tracking-widest uppercase whitespace-nowrap">✦ Catalog Project ✦</span>
      <div className="flex-1 h-px bg-gray-200" />
    </AnimatedSection>

    {/* ── IMAGE ROW ── */}
   {/* ── IMAGE ROW ── */}
    <AnimatedSection delay={0.1} className="flex gap-4 mb-14">

      {/* Nexora Dashboard */}
      <div className="flex-1 relative overflow-hidden rounded-2xl cursor-pointer h-64
        border-2 border-transparent
        hover:border-fuchsia-500 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(192,38,211,0.45)]
        transition-all duration-300 group">
        <img src="/assets/saas.jpg" alt="Nexora Dashboard"/>
        {/* Gradient bawah */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        {/* Label kategori pojok atas */}
        <div className="absolute top-3 left-3 bg-fuchsia-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
          SaaS Platform
        </div>
        {/* Nama project bawah */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white font-extrabold text-base leading-tight drop-shadow">Saas Convert Audio</p>
          <p className="text-white/60 text-xs mt-0.5">React · Node.js</p>
        </div>
        {/* Corner frame kanan atas — dekorasi */}
        <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-fuchsia-400 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-fuchsia-400 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* CaféPOS Pro */}
      <div className="flex-1 relative overflow-hidden rounded-2xl cursor-pointer h-64
        border-2 border-transparent
        hover:border-amber-400 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(251,191,36,0.45)]
        transition-all duration-300 group">
        <img src="/assets/pos-cs.png" alt="CaféPOS Pro"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
          POS Cashier
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white font-extrabold text-base leading-tight drop-shadow">POS System Cashier</p>
          <p className="text-white/60 text-xs mt-0.5">React · Express · MySQL</p>
        </div>
        <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-amber-400 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-amber-400 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Attendly School */}
      <div className="flex-1 relative overflow-hidden rounded-2xl cursor-pointer h-64
        border-2 border-transparent
        hover:border-cyan-400 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(34,211,238,0.45)]
        transition-all duration-300 group">
        <img src="/assets/absensi.png" alt="Attendly School"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute top-3 left-3 bg-cyan-400 text-cyan-900 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
          Sistem Absensi
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white font-extrabold text-base leading-tight drop-shadow">Attendly School</p>
          <p className="text-white/60 text-xs mt-0.5">JavaScript · HTML5 · CSS3</p>
        </div>
        <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-cyan-400 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-cyan-400 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* KosanKu Finder */}
      <div className="flex-1 relative overflow-hidden rounded-2xl cursor-pointer h-64
        border-2 border-transparent
        hover:border-emerald-400 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(52,211,153,0.45)]
        transition-all duration-300 group">
        <img src="/assets/kosan.png" alt="KosanKu Finder"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute top-3 left-3 bg-emerald-400 text-emerald-900 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
          Landing Page
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white font-extrabold text-base leading-tight drop-shadow">Landing Page Kos</p>
          <p className="text-white/60 text-xs mt-0.5">HTML · CSS · JavaScript </p>
        </div>
        <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-emerald-400 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-emerald-400 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

    </AnimatedSection>

    {/* ── CTA ── */}
    <AnimatedSection delay={0.2} className="flex flex-col items-center gap-3">
      <p className="text-sm text-gray-400">Tertarik? Hubungi kami langsung via WhatsApp</p>
      <a  href="https://wa.me/6281330500362" target="_blank" rel="noopener noreferrer" 
      className="flex items-center gap-3 bg-white border-2 border-green-400 text-green-700 font-bold px-8 py-4 rounded-2xl hover:bg-green-50 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(74,222,128,0.35)] transition-all duration-200 text-base">
        <svg viewBox="0 0 24 24" fill="#25D366" className="w-6 h-6">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.444h.005c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.479-8.447z" fill="#25D366"/>
        </svg>
        Hubungi Kami: +62 813-3050-0362
      </a>
    </AnimatedSection>

  </div>
</section>
 
      {/* ── FOOTER ── */}
{/* ── FOOTER ── */}
<footer className="relative overflow-hidden" style={{ background: '#6d28d9', padding: '40px 40px 0' }}>

  {/* Dot grid */}
  <div className="absolute inset-0 pointer-events-none" style={{
    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
    backgroundSize: '28px 28px'
  }} />

  {/* Glow */}
  <div className="absolute pointer-events-none" style={{
    top: -100, left: '50%', transform: 'translateX(-50%)',
    width: 500, height: 200,
    background: 'rgba(167,139,250,0.18)',
    borderRadius: '50%'
  }} />

  <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr', gap: 32, paddingBottom: 28, alignItems: 'start' }}>

      {/* Kolom kiri — brand */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg viewBox="0 0 24 24" fill="white" style={{ width: 16, height: 16 }}>
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>PromptNote</span>
        </div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 8,
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: 999, padding: '2px 8px', fontSize: 10, color: 'rgba(255,255,255,0.75)',
        }}>
          <i className="ti ti-rocket" style={{ fontSize: 10 }} /> Baru diluncurkan
        </div>

        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, marginBottom: 12, maxWidth: 260 }}>
          Simpan, kelola, dan temukan prompt AI favorit Anda dengan mudah, aman, dan cepat.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
  {[
    { icon: 'ti-home', title: 'Beranda', sub: 'Kembali ke halaman utama', href: '#beranda' },
    { icon: 'ti-user', title: 'About', sub: 'Tentang website & developer', href: '#about' },
    { icon: 'ti-info-circle', title: 'Info', sub: 'Informasi dan detail layanan', href: '#info' },
    { icon: 'ti-sparkles', title: 'PromptLab', sub: 'Lihat fitur unggulan website', onClick: handleFiturClick },
  ].map(({ icon, title, sub, href, onClick }) => (
   <a
  key={title}
  href={href || '#'}
  onClick={onClick}
  style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.11)',
        borderRadius: 8,
        padding: '7px 10px',
        textDecoration: 'none',
        transition: 'all .15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.11)'
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          flexShrink: 0,
          background: 'rgba(255,255,255,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <i className={`ti ${icon}`} style={{ fontSize: 12, color: '#fff' }} />
      </div>

      <div>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: '#fff' }}>
          {title}
        </div>

        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>
          {sub}
        </div>
      </div>
    </a>
  ))}
</div>
      </div>

      {/* Kolom tengah — navigasi */}
     <div>
  <p
    style={{
      fontSize: 10,
      fontWeight: 700,
      color: 'rgba(255,255,255,0.38)',
      letterSpacing: '0.7px',
      textTransform: 'uppercase',
      marginBottom: 10,
    }}
  >
    Navigasi
  </p>

  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    {[
      { icon: 'ti-home', label: 'Beranda', href: '#beranda' },
      { icon: 'ti-user', label: 'About', href: '#about' },
      { icon: 'ti-info-circle', label: 'Info', href: '#info' },
      { icon: 'ti-sparkles', label: 'PromptLab', onClick: handleFiturClick  },
    ].map(({ icon, label, href, onClick }) => (
      <a
  key={label}
  href={href || '#'}
  onClick={onClick}
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    padding: '7px 10px',
    borderRadius: 8,
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.78)',
    border: '1px solid transparent',
    textDecoration: 'none',
    transition: 'all .15s',
  }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
          e.currentTarget.style.color = '#fff'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.borderColor = 'transparent'
          e.currentTarget.style.color = 'rgba(255,255,255,0.78)'
        }}
      >
        <i
          className={`ti ${icon}`}
          style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}
        />

        {label}
      </a>
    ))}
  </div>
</div>

      {/* Kolom kanan — CTA */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.7px', textTransform: 'uppercase', marginBottom: 10 }}>
          Mulai sekarang
        </p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 12 }}>
          Gratis selamanya untuk penggunaan dasar. Tidak perlu kartu kredit.
        </p>
        <a href="/Register" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          padding: '9px 16px', borderRadius: 8,
          background: '#fff', color: '#6d28d9',
          fontSize: 12.5, fontWeight: 700, textDecoration: 'none',
          transition: 'opacity .15s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          <i className="ti ti-rocket" style={{ fontSize: 14 }} /> Daftar Gratis
        </a>
      </div>

    </div>

    {/* Bottom bar */}
    <div style={{
      borderTop: '1px solid rgba(255,255,255,0.12)',
      padding: '12px 0 14px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', margin: 0 }}>
        © 2026 PromptNote. All rights reserved.
      </p>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.11)',
        borderRadius: 999, padding: '3px 9px', fontSize: 10, color: 'rgba(255,255,255,0.4)',
      }}>
        <i className="ti ti-shield-check" style={{ fontSize: 11 }} /> Aman & Terenkripsi
      </div>
    </div>
  </div>
</footer>
    </div>
  );
}