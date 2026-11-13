import { IconArrow } from "./Icons";

export default function Button({ children, loading, arrow = true, ...props }) {
  return (
    <button
      className="relative flex w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-brand active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      ) : (
        <>
          {children}
          {arrow && <IconArrow width={18} height={18} className="absolute right-5" />}
        </>
      )}
    </button>
  );
}
