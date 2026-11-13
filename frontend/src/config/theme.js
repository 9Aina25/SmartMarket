export const theme = {
  brand: {
    name: "SmartMarket",
    tagline: "C'est facile, c'est rapide, c'est chez nous.",
    logoImage: "/images/logo.svg",
    authImage: "/images/image.jpg",
  },

  colors: {
    brand: "#b9532b",
    brandAlt: "#d9773f",
    heroFrom: "#efe0d0",
    heroVia: "#e2c3a6",
    heroTo: "#c9835a",
    surface: "#f6f0e9",
    ink: "#1f1b18",
  },

  allowedEmailDomains: ["gmail.com"],
};

const VARS = {
  brand: "--brand",
  brandAlt: "--brand-alt",
  heroFrom: "--hero-from",
  heroVia: "--hero-via",
  heroTo: "--hero-to",
  surface: "--surface",
  ink: "--ink",
};

export function applyTheme() {
  const root = document.documentElement;
  Object.entries(VARS).forEach(([key, cssVar]) => {
    root.style.setProperty(cssVar, theme.colors[key]);
  });
  document.title = theme.brand.name;
}
