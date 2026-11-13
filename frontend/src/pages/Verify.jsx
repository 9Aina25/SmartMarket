import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import CodeInput from "../components/CodeInput";
import Button from "../components/Button";
import Alert from "../components/Alert";
import { authApi } from "../lib/api";
import { pending, masquerEmail } from "../lib/pending";

const DELAI_RENVOI = 60; 

export default function Verify() {
  const navigate = useNavigate();
  const email = pending.email();
  const [digits, setDigits] = useState(Array(6).fill(""));
  const [resetKey, setResetKey] = useState(0);
  const [erreur, setErreur] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [valide, setValide] = useState(false);
  const [reste, setReste] = useState(() => Math.max(0, DELAI_RENVOI - pending.secondsSinceSent()));

  useEffect(() => {
    if (reste <= 0) return;
    const id = setTimeout(() => setReste((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [reste]);

  if (!email) return <Navigate to="/inscription" replace />;

  function vider() {
    setDigits(Array(6).fill(""));
    setResetKey((k) => k + 1);
  }

  async function valider(code) {
    if (loading || valide) return;
    setErreur(""); setInfo(""); setLoading(true);
    try {
      await authApi.verifyCode(email, code);
      setValide(true);
      pending.clear();
      setTimeout(() => navigate("/connexion", { state: { email, verifie: true } }), 1300);
    } catch (err) {
      setErreur(err.message);
      vider();
    } finally {
      setLoading(false);
    }
  }

  async function renvoyer() {
    setErreur(""); setInfo("");
    try {
      await authApi.resendCode(email);
      pending.markSent();
      setReste(DELAI_RENVOI);
      setInfo("Un nouveau code vient d'être envoyé. L'ancien n'est plus valable.");
      vider();
    } catch (err) {
      setErreur(err.message);
      if (err.status === 429) setReste(DELAI_RENVOI);
    }
  }

  const complet = digits.every((d) => d !== "");

  return (
    <AuthLayout
     
      title="Vérifiez votre e-mail"
      subtitle={<>Saisissez le code à 6 chiffres envoyé à <strong className="text-ink">{masquerEmail(email)}</strong>. Il est valable 15 minutes.</>}
      footer={<>Mauvaise adresse ? <Link to="/inscription" className="font-semibold text-brand hover:underline" onClick={() => pending.clear()}>Recommencer l'inscription</Link></>}
    >
      <Alert>{erreur}</Alert>
      <Alert type="ok">{valide ? "Compte activé ! Redirection vers la connexion..." : info}</Alert>

      <CodeInput digits={digits} onChange={setDigits} onComplete={valider} disabled={loading || valide} resetKey={resetKey} />

      <div className="mt-6">
        <Button type="button" loading={loading} disabled={!complet || valide} onClick={() => valider(digits.join(""))}>
          Valider le code
        </Button>
      </div>

      <p className="mt-5 text-center text-sm text-ink/60">
        Pas reçu ?{" "}
        {reste > 0 ? (
          <span>Renvoyer le code dans {reste} s</span>
        ) : (
          <button type="button" onClick={renvoyer} className="font-semibold text-brand hover:underline">Renvoyer un code</button>
        )}
      </p>
    </AuthLayout>
  );
}
