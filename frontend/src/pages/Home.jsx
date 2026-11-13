import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Logo from "../components/Logo";
import { IconSearch, IconHeart, IconPin, IconChat } from "../components/Icons";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { theme } from "../config/theme";
import { CATEGORIES, DEMO_LISTINGS } from "../data/demoListings";

const ANNEE = new Date().getFullYear();
const TEINTES = ["from-brand/80 to-brand-alt/70", "from-ink/80 to-ink/50", "from-amber-500/80 to-orange-400/70"];

export default function Home() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [recherche, setRecherche] = useState("");
  const [categorie, setCategorie] = useState("Toutes");
  const [favoris, setFavoris] = useState([]);

  const resultats = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    return DEMO_LISTINGS.filter(
      (a) =>
        (categorie === "Toutes" || a.categorie === categorie) &&
        (!q || a.titre.toLowerCase().includes(q) || a.lieu.toLowerCase().includes(q))
    );
  }, [recherche, categorie]);

  // Les visiteurs peuvent tout regarder ; agir (favoris, contact) demande un compte.
  function exiger(action) {
    if (user) return true;
    toast.info(`Connectez-vous ou créez un compte pour ${action}.`, {
      titre: "Connexion requise",
      action: { label: "Se connecter", onClick: () => navigate("/connexion", { state: { from: "/" } }) },
    });
    return false;
  }

  function basculerFavori(id) {
    if (!exiger("ajouter des favoris")) return;
    setFavoris((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }

  function contacter() {
    if (!exiger("contacter le vendeur")) return;
    toast.info("La messagerie arrive dans une prochaine étape du projet.", { titre: "Bientôt disponible" });
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 py-6">
        {/* Bandeau de recherche */}
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[var(--hero-from)] via-[var(--hero-via)] to-[var(--hero-to)] p-6 text-white shadow-xl sm:p-10">
          <h1 className="max-w-xl text-3xl font-bold leading-tight sm:text-4xl">{theme.brand.tagline}</h1>
          <p className="mt-2 max-w-lg text-sm text-white/80">
            Parcourez librement les annonces. Un compte n'est nécessaire que pour contacter les vendeurs, publier ou enregistrer des favoris.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex max-w-2xl flex-col gap-2 sm:flex-row">
            <label className="flex flex-1 items-center gap-2.5 rounded-xl bg-white px-3.5 text-ink shadow-md">
              <IconSearch className="shrink-0 text-ink/40" />
              <input
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Que cherchez-vous ? (ex. moto, Antsirabe)"
                aria-label="Rechercher une annonce"
                className="w-full bg-transparent py-3 text-[15px] outline-none placeholder:text-ink/35"
              />
            </label>
          </form>
          {!user && (
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
              <Link to="/inscription" className="rounded-lg bg-white px-4 py-2 font-semibold text-brand hover:bg-white/90">Créer un compte</Link>
              <Link to="/connexion" className="font-medium text-white/90 underline-offset-4 hover:underline">J'ai déjà un compte</Link>
            </div>
          )}
        </section>

        {/* Catégories */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Catégories">
          {["Toutes", ...CATEGORIES].map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={categorie === c}
              onClick={() => setCategorie(c)}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                categorie === c ? "border-brand bg-brand text-white" : "border-ink/12 bg-white hover:border-brand/50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <p className="mt-4 text-xs text-ink/50">
          Annonces d'exemple pour la démonstration : les vraies annonces arriveront avec le module Annonces.
        </p>

        {/* Annonces */}
        {resultats.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-ink/20 bg-white p-10 text-center text-ink/60">
            Aucune annonce ne correspond à « {recherche} ». Essayez un autre mot ou une autre catégorie.
          </div>
        ) : (
          <ul className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {resultats.map((a) => {
              const favori = favoris.includes(a.id);
              return (
                <li key={a.id} className="group overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm transition hover:shadow-lg">
                  <div className={`relative grid h-40 place-items-center bg-linear-to-br ${TEINTES[a.id % TEINTES.length]}`}>
                    <span className="rounded-full bg-white/25 px-3 py-1 text-xs font-semibold text-white backdrop-blur">{a.categorie}</span>
                    <button
                      onClick={() => basculerFavori(a.id)}
                      aria-label={favori ? "Retirer des favoris" : "Ajouter aux favoris"}
                      aria-pressed={favori}
                      className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white shadow ${favori ? "text-red-500" : "text-ink/45 hover:text-red-500"}`}
                    >
                      <IconHeart filled={favori} />
                    </button>
                  </div>
                  <div className="p-4">
                    <h2 className="line-clamp-2 min-h-[2.75rem] font-semibold leading-snug">{a.titre}</h2>
                    <p className="mt-1 text-lg font-bold text-brand">{a.prix}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-ink/55"><IconPin width={14} height={14} />{a.lieu} · {a.depuis}</p>
                    <button onClick={contacter} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-ink/15 py-2.5 text-sm font-semibold hover:border-brand hover:text-brand">
                      <IconChat width={16} height={16} /> Contacter le vendeur
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      <footer className="mt-12 border-t border-ink/10 bg-white py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 text-sm text-ink/55 sm:flex-row">
          <Logo size={30} />
          <p>© {ANNEE} {theme.brand.name} — Antsirabe, Madagascar</p>
        </div>
      </footer>
    </div>
  );
}
