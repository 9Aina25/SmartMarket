// E-mail en cours de vérification, conservé le temps de l'onglet (sessionStorage).
const EMAIL = "sm_pending_email";
const SENT = "sm_code_sent_at";

function lire(cle) {
  try { return sessionStorage.getItem(cle); } catch { return null; }
}
function ecrire(cle, valeur) {
  try { sessionStorage.setItem(cle, valeur); } catch { /* ignoré */ }
}

export const pending = {
  email: () => lire(EMAIL) || "",
  setEmail: (e) => ecrire(EMAIL, e),
  markSent: () => ecrire(SENT, String(Date.now())),
  secondsSinceSent: () => {
    const t = Number(lire(SENT));
    return t ? Math.floor((Date.now() - t) / 1000) : Infinity;
  },
  clear: () => {
    try { sessionStorage.removeItem(EMAIL); sessionStorage.removeItem(SENT); } catch { /* ignoré */ }
  },
};

export function masquerEmail(email) {
  const [local = "", domaine = ""] = email.split("@");
  return `${local.slice(0, 2)}${"•".repeat(Math.max(local.length - 2, 2))}@${domaine}`;
}
