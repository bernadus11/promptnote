import Icon from "./Icon";

export default function DeleteModal({ prompt, onConfirm, onCancel }) {
  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        background: "rgba(15,23,42,.6)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 20, width: "100%", maxWidth: 400,
          boxShadow: "0 24px 64px rgba(0,0,0,.18)", overflow: "hidden",
        }}
      >
        <div style={{ height: 3, background: "linear-gradient(90deg,#EF4444,#F97316)" }} />
        <div style={{ padding: "32px 32px 28px", textAlign: "center" }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, background: "#FEF2F2",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
          }}>
            <Icon n="trash" size={22} style={{ color: "#EF4444" }} />
          </div>
          <h2 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#0F172A" }}>Hapus Prompt?</h2>
          <p style={{ margin: "0 0 24px", fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>
            Prompt <strong style={{ color: "#0F172A" }}>"{prompt?.title}"</strong> akan dihapus secara permanen.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onCancel}
              style={{
                flex: 1, padding: "11px 0", borderRadius: 10,
                border: "1.5px solid #E5E7EB", background: "white",
                color: "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer",
              }}
            >Batal</button>
            <button
              onClick={onConfirm}
              style={{
                flex: 1, padding: "11px 0", borderRadius: 10, border: "none",
                background: "#EF4444", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
              }}
            >Hapus</button>
          </div>
        </div>
      </div>
    </div>
  );
}