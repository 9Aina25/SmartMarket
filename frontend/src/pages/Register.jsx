import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Field from "../components/Field";
import Button from "../components/Button";
import Alert from "../components/Alert";
import GoogleButton from "../components/GoogleButton";
import { IconUser, IconMail, IconPhone, IconLock, IconCart, IconStore } from "../components/Icons";
import { authApi } from "../lib/api";
import { pending } from "../lib/pending";
import { theme } from "../config/theme";

function force(mdp) {
  let n = 0;
  if (mdp.length >= 8) n++;
  if (/[a-z]/.test(mdp) && /[A-Z]/.test(mdp)) n++;
  if (/\d/.test(mdp)) n++;
  if (/[^A-Za-z0-9]/.test(mdp) || mdp.length >= 12) n++;
  return n;
}
const NIVEAUX = ["Trop court", "Faible", "Moyen", "Bon", "Excellent"];
const COULEURS = ["bg-red-400", "bg-red-400", "bg-amber-400", "bg-lime-500", "bg-emerald-500"];

const ROLES = [
  { id: "acheteur", titre: "Acheteur", Icone: IconCart },
  { id: "vendeur", titre: "Vendeur", Icone: IconStore },
];

export default function Register() {
  const navigate = useNavigate();
  const [f, setF] = useState({ nom: "", email: "", telephone: "", password: "", confirm: "", role: "acheteur" });
  const [erreurs, setErreurs] = useState({});
  const [erreurGlobale, setErreurGlobale] = useState("");
  const [loading, setLoading] = useState(false);

  const maj = (champ) => (e) => setF((s) => ({ ...s, [champ]: e.target.value }));

  function valider() {
    const e = {};
    if (f.nom.trim().length < 2) e.nom = "Entrez votre nom (2 caractères minimum).";
    const email = f.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Adresse e-mail invalide.";
    else if (theme.allowedEmailDomains.length && !theme.allowedEmailDomains.includes(email.split("@")[1]))
      e.email = `Seules les adresses ${theme.allowedEmailDomains.map((d) => "@" + d).join(", ")} sont acceptées.`;
    if (f.password.length < 8) e.password = "8 caractères minimum.";
    if (f.confirm !== f.password) e.confirm = "Les mots de passe ne correspondent pas.";
    setErreurs(e);
    return Object.keys(e).length === 0;
  }

  async function envoyer(ev) {
    ev.preventDefault();
    setErreurGlobale("");
    if (!valider()) return;
    setLoading(true);
    const email = f.email.trim().toLowerCase();
    try {
      await authApi.register({
        nom: f.nom.trim(),
        email,
        password: f.password,
        role: f.role,
        telephone: f.telephone.trim() || null,
      });
      pending.setEmail(email);
      pending.markSent();
      navigate("/verification");
    } catch (err) {
      setErreurGlobale(err.message);
    } finally {
      setLoading(false);
    }
  }

  const score = f.password ? Math.min(force(f.password), f.password.length < 8 ? 1 : 4) : 0;

  return (
    <AuthLayout
     
      title="Créer un compte"
      subtitle="Rejoignez SmartMarket en quelques instants."
      footer={<>Déjà inscrit ? <Link to="/connexion" className="font-semibold text-brand hover:underline">Se connecter</Link></>}
    >
      <GoogleButton role={f.role} onError={setErreurGlobale} />
      <form onSubmit={envoyer} noValidate>
        <Alert>{erreurGlobale}</Alert>

        <div className="mb-5 flex gap-3" role="radiogroup" aria-label="Rôle">
          {ROLES.map(({ id, titre, Icone }) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={f.role === id}
              onClick={() => setF((s) => ({ ...s, role: id }))}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                f.role === id ? "border-brand bg-brand/5 text-brand ring-1 ring-brand" : "border-ink/10 bg-white text-ink/70 hover:border-brand/40"
              }`}
            >
              <Icone /> {titre}
            </button>
          ))}
        </div>

        <Field id="nom" label="Nom complet" icon={IconUser} value={f.nom} onChange={maj("nom")} error={erreurs.nom} autoComplete="name" placeholder="Aina Rakoto" />
        <Field id="email" label="Adresse e-mail" icon={IconMail} type="email" value={f.email} onChange={maj("email")} error={erreurs.email} autoComplete="email" placeholder="vous@gmail.com" />
        <Field id="tel" label="Téléphone (facultatif)" icon={IconPhone} type="tel" value={f.telephone} onChange={maj("telephone")} autoComplete="tel" placeholder="034 00 000 00" />
        <Field id="password" label="Mot de passe" icon={IconLock} type="password" value={f.password} onChange={maj("password")} error={erreurs.password} autoComplete="new-password" placeholder="8 caractères minimum" />
        {f.password && (
          <div className="-mt-2 mb-4">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((n) => (
                <span key={n} className={`h-1.5 flex-1 rounded-full ${n <= score ? COULEURS[score] : "bg-ink/10"}`} />
              ))}
            </div>
            <p className="mt-1 text-xs text-ink/55">Sécurité : {NIVEAUX[score]}</p>
          </div>
        )}
        <Field id="confirm" label="Confirmer le mot de passe" icon={IconLock} type="password" value={f.confirm} onChange={maj("confirm")} error={erreurs.confirm} autoComplete="new-password" />

        <Button type="submit" loading={loading}>Recevoir mon code</Button>
      </form>
    </AuthLayout>
  );
}
