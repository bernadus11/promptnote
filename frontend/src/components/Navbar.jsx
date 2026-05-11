import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Navbar({ user }) {
  const [scrolled, setScrolled]         = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/Login");
  };

  const handleBackToHome = async (e) => {
    e?.preventDefault();
    await supabase.auth.signOut();
    navigate("/");
  };

  const initials = user?.email?.charAt(0).toUpperCase() || "?";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
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
          <span className="font-extrabold text-gray-900 text-lg tracking-tight">PromptNote</span>
        </div>

        {/* Menu + User */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="/"
            onClick={handleBackToHome}
            className="text-zinc-900 font-bold text-sm hover:border-b-2 hover:border-violet-500 pb-0.5 transition-all duration-300"
          >
            Beranda
          </a>
          <a
            href="/Fituroption"
            className="text-violet-700 font-bold text-sm hover:border-b-2 hover:border-violet-500 pb-0.5 transition-all duration-300"
          >
            PromptLab
          </a>

          {user && (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 12px 6px 6px",
                  border: "1.5px solid #EDE9FE", borderRadius: 999,
                  background: "white", cursor: "pointer", transition: "all .15s",
                }}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "linear-gradient(135deg,#6D28D9,#4F46E5)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0,
                }}>
                  {initials}
                </div>
                <span style={{
                  fontSize: 12, fontWeight: 600, color: "#374151",
                  maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {user.email?.split("@")[0]}
                </span>
                <i className="ti ti-chevron-down" style={{ fontSize: 12, color: "#94A3B8" }} />
              </button>

              {showDropdown && (
                <div
                  onClick={() => setShowDropdown(false)}
                  style={{
                    position: "absolute", top: "calc(100% + 8px)", right: 0,
                    background: "#fff", borderRadius: 14, minWidth: 220,
                    boxShadow: "0 8px 32px rgba(0,0,0,.12)", border: "1px solid #F1F5F9",
                    overflow: "hidden", zIndex: 100,
                  }}
                >
                  <div style={{ padding: "14px 16px", borderBottom: "1px solid #F1F5F9" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: "linear-gradient(135deg,#6D28D9,#4F46E5)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 15, fontWeight: 700, color: "#fff", flexShrink: 0,
                      }}>
                        {initials}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0F172A" }}>
                          {user.email?.split("@")[0]}
                        </p>
                        <p style={{
                          margin: 0, fontSize: 11, color: "#94A3B8",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 10,
                      padding: "12px 16px", border: "none", background: "none",
                      cursor: "pointer", color: "#EF4444", fontSize: 13, fontWeight: 600,
                      textAlign: "left", transition: "background .15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#FEF2F2")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                  >
                    <i className="ti ti-logout" style={{ fontSize: 15, color: "#EF4444" }} />
                    Keluar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}