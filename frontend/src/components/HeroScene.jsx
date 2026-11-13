/** Illustration par défaut (SVG) : étiquette de prix et sacs sur fond chaud. Couleurs du thème. */
export default function HeroScene() {
  const s = (v) => ({ stopColor: `var(${v})` });
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={s("--hero-from")} />
          <stop offset="0.6" style={s("--hero-via")} />
          <stop offset="1" style={s("--hero-to")} />
        </linearGradient>
      </defs>
      <rect width="600" height="800" fill="url(#bg)" />
      <path d="M60 520V300a120 120 0 0 1 240 0v220Z" fill="#fff" opacity="0.28" />
      <path d="M300 520V260a120 120 0 0 1 240 0v260Z" fill="#fff" opacity="0.18" />
      <circle cx="430" cy="190" r="70" fill="#fff" opacity="0.35" />
      <rect y="560" width="600" height="240" fill="#1f1b18" opacity="0.14" />
      {/* Sac 1 */}
      <g transform="translate(110 430)">
        <path d="M0 40h150l-12 170a14 14 0 0 1-14 13H26a14 14 0 0 1-14-13Z" fill="#fff7ef" />
        <path d="M45 40V28a30 30 0 0 1 60 0v12" fill="none" stroke="#fff7ef" strokeWidth="7" strokeLinecap="round" />
        <circle cx="75" cy="120" r="22" fill="var(--brand)" />
      </g>
      {/* Sac 2 */}
      <g transform="translate(300 480)">
        <path d="M0 40h120l-10 140a14 14 0 0 1-14 13H24a14 14 0 0 1-14-13Z" fill="var(--brand)" />
        <path d="M36 40V30a24 24 0 0 1 48 0v10" fill="none" stroke="var(--brand)" strokeWidth="7" strokeLinecap="round" />
      </g>
      {/* Étiquette de prix (forme du logo) */}
      <g transform="translate(330 250) rotate(14) scale(3.1)">
        <path fillRule="evenodd" fill="#fff7ef" d="M20 6H50a8 8 0 0 1 8 8V42a8 8 0 0 1-8 8H20L4 28Z M20 20.5a7.5 7.5 0 1 0 .001 0Z" />
      </g>
    </svg>
  );
}
