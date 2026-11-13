import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconGoogle } from "./Icons";
import { useAuth } from "../context/AuthContext";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
let scriptPromise;

function chargerGoogle() {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  scriptPromise ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = null;
      s.remove();
      reject(new Error("Impossible de charger Google. Vérifiez votre connexion."));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/** Continuer avec Google. `role` : rôle choisi (inscription) ; `onError(message)` affiche l'erreur. */
export default function GoogleButton({ role, onError = () => {} }) {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pret, setPret] = useState(false);
  const clientRef = useRef(null);
  // Valeurs les plus récentes, lues au moment de la réponse de Google.
  const roleRef = useRef(role);
  const onErrorRef = useRef(onError);
  const actif = useRef(true);

  useEffect(() => { roleRef.current = role; onErrorRef.current = onError; });

  useEffect(() => {
    actif.current = true;
    return () => { actif.current = false; };
  }, []);

  // On charge Google et on prépare le client dès l'affichage : au clic, la fenêtre s'ouvre
  // immédiatement (sinon le navigateur peut bloquer la fenêtre contextuelle).
  useEffect(() => {
    if (!CLIENT_ID) return;
    let annule = false;
    chargerGoogle()
      .then(() => {
        if (annule) return;
        clientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: "openid email profile",
          callback: async (rep) => {
            if (rep.error || !rep.access_token) {
              if (actif.current) setLoading(false);
              return;
            }
            try {
              await loginWithGoogle(rep.access_token, roleRef.current);
              navigate("/profil", { replace: true });
            } catch (err) {
              if (!actif.current) return;
              onErrorRef.current(err.message);
              setLoading(false);
            }
          },
          error_callback: (e) => {
            if (!actif.current) return;
            if (e?.type === "popup_failed_to_open") {
              onErrorRef.current("La fenêtre Google a été bloquée. Autorisez les fenêtres contextuelles puis réessayez.");
            }
            setLoading(false); // fenêtre fermée
          },
        });
        setPret(true);
      })
      .catch((err) => { if (!annule) onErrorRef.current(err.message); });
    return () => { annule = true; };
  }, [loginWithGoogle, navigate]);

  function cliquer() {
    onError("");
    if (!CLIENT_ID) return onError("Connexion Google non configurée (VITE_GOOGLE_CLIENT_ID manquant dans .env).");
    if (!clientRef.current) return onError("Google n'est pas encore prêt. Réessayez dans un instant.");
    setLoading(true);
    clientRef.current.requestAccessToken();
  }

  return (
    <>
      <button
        type="button"
        onClick={cliquer}
        disabled={loading || (!!CLIENT_ID && !pret)}
        className="flex w-full items-center justify-center gap-2.5 rounded-full border border-ink/10 bg-white px-5 py-3 text-sm font-medium shadow-sm transition hover:border-ink/25 disabled:opacity-60"
      >
        {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/20 border-t-ink" /> : <IconGoogle />}
        Continuer avec Google
      </button>
      <div className="my-5 flex items-center gap-3 text-xs text-ink/40">
        <span className="h-px flex-1 bg-ink/10" /> OU <span className="h-px flex-1 bg-ink/10" />
      </div>
    </>
  );
}
