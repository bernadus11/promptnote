import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

const FEATURES = [
  { icon: "ti-shield-lock", title: "Enkripsi end-to-end", sub: "Prompt Anda aman & privat"    },
  { icon: "ti-bolt",        title: "Akses instan",        sub: "Temukan prompt dalam detik"    },
  { icon: "ti-devices",     title: "Multi-platform",      sub: "Tersinkron di semua perangkat" },
];

export default function Footer() {
  const navigate = useNavigate();

  const handleBackToHome = async (e) => {
    e?.preventDefault();
    await supabase.auth.signOut();
    navigate("/");
  };

  const navLinks = [
    { icon: "ti-home",     label: "Beranda", href: "/",            onClick: handleBackToHome },
    { icon: "ti-sparkles", label: "Fitur",   href: "/Fituroption", onClick: undefined        },
  ];

  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "#17274c", padding: "40px 24px 0", marginTop: 80 }}
    >
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }} />

      {/* Glow */}
      <div className="absolute pointer-events-none" style={{
        top: -100, left: "50%", transform: "translateX(-50%)",
        width: 500, height: 200,
        background: "rgba(167,139,250,0.18)", borderRadius: "50%",
      }} />

      <div className="max-w-6xl mx-auto relative" style={{ zIndex: 2 }}>

        {/* Grid — 1 kolom mobile, 3 kolom desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8">

          {/* Kolom kiri — brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg viewBox="0 0 24 24" fill="white" style={{ width: 16, height: 16 }}>
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
              </div>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: "-0.3px" }}>
                PromptNote
              </span>
            </div>

            <div style={{
              display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 8,
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 999, padding: "2px 8px", fontSize: 10, color: "rgba(255,255,255,0.75)",
            }}>
              <i className="ti ti-rocket" style={{ fontSize: 10 }} /> Baru diluncurkan
            </div>

            <p style={{
              fontSize: 12, color: "rgba(255,255,255,0.6)",
              lineHeight: 1.65, marginBottom: 12, maxWidth: 260,
            }}>
              Simpan, kelola, dan temukan prompt AI favorit Anda dengan mudah, aman, dan cepat.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {FEATURES.map(({ icon, title, sub }) => (
                <div key={title} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.11)",
                  borderRadius: 8, padding: "7px 10px",
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    background: "rgba(255,255,255,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <i className={`ti ${icon}`} style={{ fontSize: 12, color: "#fff" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11.5, fontWeight: 600, color: "#fff" }}>{title}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kolom tengah — navigasi */}
          <div>
            <p style={{
              fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.38)",
              letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 10,
            }}>
              Navigasi
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {navLinks.map(({ icon, label, href, onClick }) => (
                <a key={label} href={href} onClick={onClick}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "7px 10px", borderRadius: 8, fontSize: 12.5,
                    color: "rgba(255,255,255,0.78)", border: "1px solid transparent",
                    textDecoration: "none", transition: "all .15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background  = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                    e.currentTarget.style.color       = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background  = "transparent";
                    e.currentTarget.style.borderColor = "transparent";
                    e.currentTarget.style.color       = "rgba(255,255,255,0.78)";
                  }}
                >
                  <i className={`ti ${icon}`} style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }} />
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Kolom kanan — CTA */}
          <div>
            <p style={{
              fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.38)",
              letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 10,
            }}>
              Mulai sekarang
            </p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 12 }}>
              Gratis selamanya untuk penggunaan dasar. Tidak perlu kartu kredit.
            </p>
            <Link to="/Login" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "9px 16px", borderRadius: 8,
              background: "#fff", color: "#6d28d9",
              fontSize: 12.5, fontWeight: 700, textDecoration: "none", transition: "opacity .15s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <i className="ti ti-rocket" style={{ fontSize: 14 }} /> Daftar Gratis
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.12)",
          padding: "12px 0 14px",
          display: "flex", flexWrap: "wrap", gap: 8,
          alignItems: "center", justifyContent: "space-between",
        }}>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", margin: 0 }}>
            © 2026 PromptNote. All rights reserved.
          </p>
          <div style={{
            display: "flex", alignItems: "center", gap: 4,
            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.11)",
            borderRadius: 999, padding: "3px 9px", fontSize: 10, color: "rgba(255,255,255,0.4)",
          }}>
            <i className="ti ti-shield-check" style={{ fontSize: 11 }} /> Aman & Terenkripsi
          </div>
        </div>
      </div>
    </footer>
  );
}