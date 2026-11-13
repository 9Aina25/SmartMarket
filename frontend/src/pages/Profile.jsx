import { useEffect, useState } from "react";
import { useAuth, expirationJeton } from "../context/AuthContext";
import Logo from "../components/Logo";
import { IconCart, IconStore, IconShield, IconMail, IconPhone, IconCheck } from "../components/Icons";

const ROLES = {
  acheteur: { label: "Acheteur", Icone: IconCart, texte: "Parcourir les annonces, ajouter des favoris, contacter les vendeurs." },
  vendeur: { label: "Vendeur", Icone: IconStore, texte: "Publier des annonces, gérer vos ventes et répondre aux acheteurs." },
  admin: { label: "Administrateur", Icone: IconShield, texte: "Modérer les annonces et gérer les utilisateurs." },
};

function tempsRestant(exp) {
  const s = Math.max(0, Math.floor((exp - Date.now()) / 1000));
  const m = Math.floor(s / 60);
  return `${m} min ${String(s % 60).padStart(2, "0")} s`;
}

export default function Profile() {
  const { user, token, logout } = useAuth();
  const exp = expirationJeton(token);
  const [, rafraichir] = useState(0);

  useEffect(() => {
    const id = setInterval(() => rafraichir((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const role = ROLES[user.role] || ROLES.acheteur;
  const nomAffiche = user.nom || user.email || "";
  const initiales = nomAffiche.split(" ").filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-3.5">
          <Logo size={34} />
          <button onClick={logout} className="rounded-lg border border-ink/15 px-4 py-2 text-sm font-medium hover:bg-ink/5">
            Se déconnecter
          </button>
        </div>
      </header>

      <main className="fade-up mx-auto max-w-4xl px-5 py-8">
        <div className="rounded-2xl bg-linear-to-r from-brand to-brand-alt p-6 text-white shadow-lg shadow-brand/20 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-white/20 text-xl font-bold">{initiales}</div>
            <div>
              <p className="text-sm text-white/75">Bienvenue</p>
              <h1 className="text-2xl font-bold">{nomAffiche}</h1>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <section className="rounded-2xl border border-ink/10 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink/50">Mon compte</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center gap-3"><IconMail className="text-ink/40" /><dd>{user.email}</dd></div>
              <div className="flex items-center gap-3"><IconPhone className="text-ink/40" /><dd>{user.telephone || "Téléphone non renseigné"}</dd></div>
              <div className="flex items-center gap-3">
                <IconCheck className="text-emerald-600" />
                <dd>Statut : <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">{user.statut || "actif"}</span></dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-ink/10 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink/50">Mon rôle</h2>
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand"><role.Icone /></span>
              <div>
                <p className="font-semibold">{role.label}</p>
                <p className="mt-0.5 text-sm text-ink/60">{role.texte}</p>
                <p className="mt-2 text-xs text-ink/45">Fonctionnalités disponibles dans les prochaines étapes du projet.</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-ink/10 bg-white p-5 md:col-span-2">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink/50">Session</h2>
            <p className="text-sm text-ink/70">
              Connexion sécurisée par jeton JWT.{" "}
              {exp ? <>Expire dans <strong>{tempsRestant(exp)}</strong> ({new Date(exp).toLocaleTimeString("fr-FR")}), puis vous serez déconnecté automatiquement.</> : null}
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
