import { useState } from "react";
import { IconEye, IconEyeOff } from "./Icons";

/** Champ avec icône, libellé et message d'erreur. Pour les mots de passe : bouton afficher/masquer. */
export default function Field({ label, icon: Icon, error, type = "text", id, ...props }) {
  const [visible, setVisible] = useState(false);
  const estMotDePasse = type === "password";

  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-1.5 block pl-4 text-xs font-medium text-ink/70">{label}</label>
      <div
        className={`flex items-center gap-2.5 rounded-full border bg-white px-4 shadow-sm transition focus-within:ring-2 focus-within:ring-brand/30 ${
          error ? "border-red-400" : "border-ink/10 focus-within:border-brand"
        }`}
      >
        {Icon && <Icon className="shrink-0 text-ink/40" />}
        <input
          id={id}
          type={estMotDePasse && visible ? "text" : type}
          className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-ink/30"
          aria-invalid={!!error}
          {...props}
        />
        {estMotDePasse && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="text-ink/40 hover:text-ink/70"
            aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {visible ? <IconEyeOff /> : <IconEye />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 pl-4 text-xs text-red-600">{error}</p>}
    </div>
  );
}
