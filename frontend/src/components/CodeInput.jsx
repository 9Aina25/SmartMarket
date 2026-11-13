import { useEffect, useRef } from "react";

/** Saisie du code à 6 chiffres : une case par chiffre, collage et touches fléchées gérés. */
export default function CodeInput({ digits, onChange, onComplete, disabled, resetKey }) {
  const refs = useRef([]);

  useEffect(() => { refs.current[0]?.focus(); }, [resetKey]);

  function maj(nouveau, focusIndex) {
    onChange(nouveau);
    if (focusIndex != null) refs.current[Math.min(focusIndex, 5)]?.focus();
    if (nouveau.every((d) => d !== "")) onComplete?.(nouveau.join(""));
  }

  function saisie(i, e) {
    const chiffres = e.target.value.replace(/\D/g, "");
    const nouveau = [...digits];
    if (!chiffres) { nouveau[i] = ""; return maj(nouveau, i); }
    chiffres.split("").slice(0, 6 - i).forEach((c, k) => { nouveau[i + k] = c; });
    maj(nouveau, i + chiffres.length);
  }

  function touche(i, e) {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus();
  }

  function colle(e) {
    const texte = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!texte) return;
    e.preventDefault();
    const nouveau = Array(6).fill("");
    texte.split("").forEach((c, k) => { nouveau[k] = c; });
    maj(nouveau, texte.length);
  }

  return (
    <div className="flex justify-between gap-2" onPaste={colle}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          value={d}
          onChange={(e) => saisie(i, e)}
          onKeyDown={(e) => touche(i, e)}
          onFocus={(e) => e.target.select()}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={6}
          disabled={disabled}
          aria-label={`Chiffre ${i + 1} du code`}
          className="h-14 w-full min-w-0 rounded-2xl border border-ink/10 bg-white text-center text-2xl font-semibold shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30 disabled:opacity-60"
        />
      ))}
    </div>
  );
}
