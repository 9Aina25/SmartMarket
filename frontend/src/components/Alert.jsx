export default function Alert({ type = "error", children }) {
  if (!children) return null;
  const styles = type === "ok"
    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
    : "border-red-200 bg-red-50 text-red-700";
  return (
    <div role={type === "ok" ? "status" : "alert"} className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  );
}
