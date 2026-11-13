function force(mdp) {
  let n = 0;
  if (mdp.length >= 8) n++;
  if (/[a-z]/.test(mdp) && /[A-Z]/.test(mdp)) n++;
  if (/\d/.test(mdp)) n++;
  if (/[^A-Za-z0-9]/.test(mdp) || mdp.length >= 12) n++;
  return Math.min(n, mdp.length < 8 ? 1 : 4);
}
const NIVEAUX = ["Trop court", "Faible", "Moyen", "Bon", "Excellent"];
const COULEURS = ["bg-red-400", "bg-red-400", "bg-amber-400", "bg-lime-500", "bg-emerald-500"];

export default function PasswordStrength({ password }) {
  if (!password) return null;
  const score = force(password);
  return (
    <div className="-mt-2 mb-4">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className={`h-1.5 flex-1 rounded-full ${n <= score ? COULEURS[score] : "bg-ink/10"}`} />
        ))}
      </div>
      <p className="mt-1 text-xs text-ink/55">Sécurité : {NIVEAUX[score]}</p>
    </div>
  );
}
