import Icon from "./Icon";

export default function EmptyState({ onAdd }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "72px 24px",
      background: "#fff", borderRadius: 20, border: "1.5px dashed #E2E8F0",
    }}>
      <p style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "#1E293B" }}>
        Belum ada prompt
      </p>
      <p style={{ margin: "0 0 24px", fontSize: 13, color: "#94A3B8" }}>
        Mulai simpan prompt AI pertamamu sekarang
      </p>
      <button
        onClick={onAdd}
        style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "10px 20px", borderRadius: 10, border: "none",
          background: "linear-gradient(135deg,#6D28D9,#4F46E5)",
          color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
          boxShadow: "0 4px 16px rgba(109,40,217,.28)",
        }}
      >
        <Icon n="plus" size={15} style={{ color: "#fff" }} /> Tambah Prompt
      </button>
    </div>
  );
}