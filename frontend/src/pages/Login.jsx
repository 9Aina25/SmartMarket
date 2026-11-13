import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Field from "../components/Field";
import Button from "../components/Button";
import Alert from "../components/Alert";
import GoogleButton from "../components/GoogleButton";
import { IconMail, IconLock } from "../components/Icons";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../lib/api";
import { pending } from "../lib/pending";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState("");
  const [nonVerifie, setNonVerifie] = useState(false);
  const [loading, setLoading] = useState(false);
  const verifie = !!location.state?.verifie;

  async function envoyer(ev) {
    ev.preventDefault();
    setErreur(""); setNonVerifie(false);
    if (!email.trim() || !password) return setErreur("Entrez votre e-mail et votre mot de passe.");
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      navigate(location.state?.from || "/profil", { replace: true });
    } catch (err) {
      setErreur(err.message);
      if (err.status === 403 && /vérifié/i.test(err.message)) setNonVerifie(true);
    } finally {
      setLoading(false);
    }
  }

  // Compte jamais vérifié : on demande un nouveau code puis on ouvre l'écran de saisie.
  async function recevoirCode() {
    const adresse = email.trim().toLowerCase();
    pending.setEmail(adresse);
    try {
      await authApi.resendCode(adresse);
      pending.markSent();
    } catch (err) {
      if (err.status !== 429) return setErreur(err.message); // 429 = un code récent existe déjà
    }
    navigate("/verification");
  }

  return (
    <AuthLayout
     
      title="Bon retour"
      subtitle="Connectez-vous pour continuer."
      footer={<>Pas encore de compte ? <Link to="/inscription" className="font-semibold text-brand hover:underline">Créer un compte</Link></>}
    >
      <GoogleButton onError={setErreur} />
      <form onSubmit={envoyer} noValidate>
        <Alert type="ok">{verifie ? "Adresse vérifiée. Vous pouvez maintenant vous connecter." : ""}</Alert>
        <Alert>{erreur}</Alert>
        {nonVerifie && (
          <button type="button" onClick={recevoirCode} className="-mt-2 mb-4 text-sm font-semibold text-brand hover:underline">
            Recevoir un nouveau code et vérifier mon e-mail
          </button>
        )}
        <Field id="email" label="Adresse e-mail" icon={IconMail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="vous@gmail.com" />
        <Field id="password" label="Mot de passe" icon={IconLock} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        <div className="mt-6"><Button type="submit" loading={loading}>Se connecter</Button></div>
      </form>
    </AuthLayout>
  );
}
