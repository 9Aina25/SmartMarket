import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../lib/api";

const CLE = "sm_token";
const AuthContext = createContext(null);

function lireJeton() {
  try { return localStorage.getItem(CLE); } catch { return null; }
}
function ecrireJeton(t) {
  try {
    if (t) localStorage.setItem(CLE, t);
    else localStorage.removeItem(CLE);
  } catch { /* ignoré */ }
}

/** Lit la date d'expiration (exp) du jeton, pour l'affichage et la déconnexion automatique. */
export function expirationJeton(token) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload)).exp * 1000;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(lireJeton);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(!lireJeton());

  const logout = useCallback(() => {
    ecrireJeton(null);
    setToken(null);
    setUser(null);
  }, []);

  // Au chargement : si un jeton existe, on le valide auprès du backend.
  useEffect(() => {
    if (!token || user) { setReady(true); return; }
    let annule = false;
    authApi.me(token)
      .then((u) => { if (!annule) setUser(u); })
      .catch((e) => { if (!annule && e.status === 401) logout(); })
      .finally(() => { if (!annule) setReady(true); });
    return () => { annule = true; };
  }, [token, user, logout]);

  // Déconnexion automatique à l'expiration du jeton.
  useEffect(() => {
    if (!token) return;
    const exp = expirationJeton(token);
    if (!exp) return;
    const delai = exp - Date.now();
    if (delai <= 0) { logout(); return; }
    const id = setTimeout(logout, Math.min(delai, 2 ** 31 - 1));
    return () => clearTimeout(id);
  }, [token, logout]);

  const login = useCallback(async (email, password) => {
    const rep = await authApi.login(email, password);
    ecrireJeton(rep.access_token);
    setToken(rep.access_token);
    setUser(rep.user);
    return rep.user;
  }, []);

  const loginWithGoogle = useCallback(async (accessToken, role) => {
    const rep = await authApi.google(accessToken, role);
    ecrireJeton(rep.access_token);
    setToken(rep.access_token);
    setUser(rep.user);
    return rep.user;
  }, []);

  const value = useMemo(() => ({ token, user, ready, login, loginWithGoogle, logout }), [token, user, ready, login, loginWithGoogle, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
