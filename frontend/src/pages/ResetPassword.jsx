import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import CodeInput from "../components/CodeInput";
import Field from "../components/Field";
import Button from "../components/Button";
import Alert from "../components/Alert";
import Stepper from "../components/Stepper";
import PasswordStrength from "../components/PasswordStrength";
import { IconLock } from "../components/Icons";
import { useToast } from "../context/ToastContext";
import { authApi } from "../lib/api";
import { pendingReset, masquerEmail } from "../lib/pending";

const DELAI_RENVOI = 60;

export default function ResetPassword() {
  const navigate = useNavigate();
  const toast = useToast();
  const [email] = useState(() => pendingReset.email()); // lu une seule fois : survit à pendingReset.clear()
  const [digits, setDigits] = useState(Array(6).fill(""));
  const [resetKey, setResetKey] = useState(0);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [erreurs, setErreurs] = useState({});
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);
  const [reste, setReste] = useState(() => Math.max(0, DELAI_RENVOI - pendingReset.secondsSinceSent()));

  useEffect(() => {
    if (reste <= 0) return;
    const id = setTimeout(() => setReste((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [reste]);

  if (!email) return <Navigate to="/mot-de-passe-oublie" replace />;

  async function envoyer(ev) {
    ev.preventDefault();
    setErreur("");
    const e = {};
    if (digits.some((d) => d === "")) e.code = "Entrez les 6 chiffres du code.";
    if (password.length < 8) e.password = "8 caractères minimum.";
    if (confirm !== password) e.confirm = "Les mots de passe ne correspondent pas.";
    setErreurs(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    try {
      await authApi.resetPassword(email, digits.join(""), password);
      pendingReset.clear();
      toast.success("Connectez-vous avec votre nouveau mot de passe.", { titre: "Mot de passe modifié" });
      navigate("/connexion", { state: { email, reinit: true } });
    } catch (err) {
      setErreur(err.message);
      setDigits(Array(6).fill(""));
      setResetKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  }

  async function renvoyer() {
    setErreur("");
    try {
      await authApi.forgotPassword(email);
      pendingReset.markSent();
      setReste(DELAI_RENVOI);
      toast.info("Si le compte existe, un nouveau code vient d'être envoyé.", { titre: "Code renvoyé" });
      setDigits(Array(6).fill(""));
      setResetKey((k) => k + 1);
    } catch (err) {
      setErreur(err.message);
    }
  }

  return (
    <AuthLayout
      page="connexion"
      title="Nouveau mot de passe"
      subtitle={<>Saisissez le code envoyé à <strong className="text-ink">{masquerEmail(email)}</strong> (valable 15 minutes), puis choisissez un nouveau mot de passe.</>}
      stepper={<Stepper steps={["Adresse e-mail", "Nouveau mot de passe"]} current={2} />}
      footer={<Link to="/mot-de-passe-oublie" className="font-semibold text-brand hover:underline" onClick={() => pendingReset.clear()}>Changer d'adresse</Link>}
    >
      <form onSubmit={envoyer} noValidate>
        <Alert>{erreur}</Alert>
        <label className="mb-1.5 block text-sm font-medium">Code à 6 chiffres</label>
        <CodeInput digits={digits} onChange={setDigits} disabled={loading} resetKey={resetKey} />
        {erreurs.code && <p className="mt-1 text-xs text-red-600">{erreurs.code}</p>}

        <div className="mt-5">
          <Field id="password" label="Nouveau mot de passe" icon={IconLock} type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={erreurs.password} autoComplete="new-password" placeholder="8 caractères minimum" />
          <PasswordStrength password={password} />
          <Field id="confirm" label="Confirmer le mot de passe" icon={IconLock} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={erreurs.confirm} autoComplete="new-password" />
        </div>

        <Button type="submit" loading={loading}>Modifier le mot de passe</Button>

        <p className="mt-5 text-center text-sm text-ink/60">
          Pas reçu ?{" "}
          {reste > 0 ? (
            <span>Renvoyer le code dans {reste} s</span>
          ) : (
            <button type="button" onClick={renvoyer} className="font-semibold text-brand hover:underline">Renvoyer un code</button>
          )}
        </p>
      </form>
    </AuthLayout>
  );
}
