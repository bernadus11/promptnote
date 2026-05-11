/* ─── ICON HELPER ───────────────────────────────────────────── */
export default function Icon({ n, size = 16, style = {} }) {
  return (
    <i
      className={`ti ti-${n}`}
      aria-hidden="true"
      style={{ fontSize: size, ...style }}
    />
  );
}