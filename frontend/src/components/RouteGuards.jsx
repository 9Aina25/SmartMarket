import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Chargement() {
  return (
    <div className="grid min-h-screen place-items-center">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand/30 border-t-brand" />
    </div>
  );
}


export function ProtectedRoute({ roles, children }) {
  const { user, token, ready } = useAuth();
  const location = useLocation();
  if (!ready) return <Chargement />;
  if (!token || !user) return <Navigate to="/connexion" replace state={{ from: location.pathname }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/profil" replace />;
  return children;
}

/** Réservé aux visiteurs : un utilisateur déjà connecté est renvoyé vers son profil. */
export function GuestRoute({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return <Chargement />;
  if (user) return <Navigate to="/profil" replace />;
  return children;
}
