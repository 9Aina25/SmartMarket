import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Field from "../components/Field";
import Button from "../components/Button";
import Alert from "../components/Alert";
import Stepper from "../components/Stepper";
import { IconMail } from "../components/Icons";
import { useToast } from "../context/ToastContext";
import { authApi } from "../lib/api";
import { pendingReset } from "../lib/pending";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [email, setEmail] = useState(location.state?.email || "");
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);

  async function envoyer(ev) {
    ev.preventDefault();
    setErreur("");
    const adresse = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adresse)) return setErreur("Adresse e-mail invalide.");
    setLoading(true);
    try {
      await authApi.forgotPassword(adresse);
      pendingReset.setEmail(adresse);
      pendingReset.markSent();
      // Même message que le compte existe ou non : on ne révèle pas les adresses inscrites.
      toast.info("Si un compte existe pour cette adresse, un code vient d'être envoyé.", { titre: "Vérifiez votre boîte mail" });
      navigate("/reinitialisation");
    } catch (err) {
      setErreur(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      page="connexion"
      title="Mot de passe oublié ?"
      subtitle="Entrez l'adresse de votre compte. Nous vous enverrons un code pour choisir un nouveau mot de passe."
      stepper={<Stepper steps={["Adresse e-mail", "Nouveau mot de passe"]} current={1} />}
      footer={<Link to="/connexion" className="font-semibold text-brand hover:underline">Retour à la connexion</Link>}
    >
      <form onSubmit={envoyer} noValidate>
        <Alert>{erreur}</Alert>
        <Field id="email" label="Adresse e-mail" icon={IconMail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="vous@gmail.com" />
        <div className="mt-6"><Button type="submit" loading={loading}>Recevoir le code</Button></div>
      </form>
    </AuthLayout>
  );
}
