import { useState } from "react";
import Logo from "./Logo";
import HeroScene from "./HeroScene";
import { theme } from "../config/theme";

/**
 * Écrans d'accès : image à gauche (masquée sur mobile), formulaire à droite.
 * L'image se règle dans config/theme.js (brand.authImage) ; si elle est absente,
 * l'illustration par défaut prend sa place.
 */
export default function AuthLayout({ title, subtitle, children, footer }) {
  const { tagline, authImage } = theme.brand;
  const [imageOk, setImageOk] = useState(true);

  return (
    <div className="min-h-screen bg-surface lg:flex">
      {/* Gauche : image (fixe pendant que le formulaire défile) */}
      <aside className="relative hidden overflow-hidden lg:sticky lg:top-0 lg:block lg:h-screen lg:w-1/2 lg:self-start">
        {authImage && imageOk ? (
          <img
            src={authImage}
            alt=""
            onError={() => setImageOk(false)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <HeroScene />
        )}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(31,27,24,0.65), rgba(31,27,24,0.05) 55%, transparent)" }}
        />
        <div className="absolute inset-x-0 bottom-0 p-10 text-white">
          <Logo light size={36} />
          {tagline && <p className="mt-3 max-w-sm text-lg font-medium leading-snug text-white/90">{tagline}</p>}
        </div>
      </aside>

      {/* Droite : formulaire */}
      <main className="flex min-h-screen flex-1 items-center justify-center px-4 py-10">
        <div className="fade-up w-full max-w-md rounded-3xl bg-white px-6 py-9 shadow-xl shadow-ink/5 sm:px-10">
          <div className="mb-7 flex justify-center lg:hidden"><Logo size={36} /></div>
          <h1 className="text-center text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-center text-sm text-ink/60">{subtitle}</p>}
          <div className="mt-7">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-ink/60">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
