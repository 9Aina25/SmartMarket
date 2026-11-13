import { theme } from "../config/theme";

export function LogoMark({ height = 40, color = "var(--brand)" }) {
  return (
    <svg height={height} viewBox="0 0 64 56" aria-hidden="true" style={{ width: "auto" }}>
      <path
        fillRule="evenodd"
        fill={color}
        stroke={color}
        strokeWidth="4"
        strokeLinejoin="round"
        d="M20 6H50a8 8 0 0 1 8 8V42a8 8 0 0 1-8 8H20L4 28Z M20 20.5a7.5 7.5 0 1 0 .001 0Z"
      />
    </svg>
  );
}

/** Logo SmartMarket (remplaçable : theme.brand.logoImage). `light` = version blanche pour fond sombre. */
export default function Logo({ light = false, size = 40 }) {
  const { name, logoImage } = theme.brand;
  if (logoImage) return <img src={logoImage} alt={name} style={{ height: size }} className="object-contain" />;

  return (
    <div className="flex items-center gap-2.5" aria-label={name}>
      <LogoMark height={size * 0.9} color={light ? "#fff" : "var(--brand)"} />
      <span className={`text-[1.35rem] font-extrabold leading-none tracking-tight ${light ? "text-white" : "text-ink"}`}>
        Smart<span className={light ? "text-white/80" : "text-brand"}>Market</span>
      </span>
    </div>
  );
}
