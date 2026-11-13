const BASE = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

function lireMessage(data, status) {
  if (data && typeof data.detail === "string") return data.detail;
  if (data && Array.isArray(data.detail)) return "Certaines informations sont invalides. Vérifiez le formulaire.";
  return `Erreur inattendue (code ${status}).`;
}

/** Appel JSON vers le backend. Lève une ApiError avec un message en français. */
export async function api(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  let rep;
  try {
    rep = await fetch(BASE + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Serveur injoignable. Vérifiez que le backend est lancé.", 0);
  }

  let data = null;
  try {
    data = await rep.json();
  } catch {
    /* réponse vide */
  }
  if (!rep.ok) throw new ApiError(lireMessage(data, rep.status), rep.status);
  return data;
}

export const authApi = {
  register: (payload) => api("/api/auth/register", { method: "POST", body: payload }),
  verifyCode: (email, code) => api("/api/auth/verify-code", { method: "POST", body: { email, code } }),
  resendCode: (email) => api("/api/auth/resend-code", { method: "POST", body: { email } }),
  login: (email, password) => api("/api/auth/login", { method: "POST", body: { email, password } }),
  google: (access_token, role) => api("/api/auth/google", { method: "POST", body: { access_token, role: role || null } }),
  me: (token) => api("/api/users/me", { token }),
};
