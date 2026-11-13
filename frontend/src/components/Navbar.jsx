import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
        <Link to="/" aria-label="Accueil" className="min-w-0"><Logo size={32} /></Link>
        <nav className="flex shrink-0 items-center gap-1 whitespace-nowrap sm:gap-3">
          {user ? (
            <>
              <Link to="/profil" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-ink/5">Mon profil</Link>
              <button onClick={() => { logout(); navigate("/"); }} className="rounded-lg border border-ink/15 px-3.5 py-2 text-sm font-medium hover:bg-ink/5">
                Se déconnecter
              </button>
            </>
          ) : (
            <>
              <Link to="/connexion" className="rounded-lg px-2.5 py-2 text-sm font-medium hover:bg-ink/5">Se connecter</Link>
              <Link to="/inscription" className="rounded-lg bg-linear-to-r from-brand to-brand-alt px-3.5 py-2 text-sm font-semibold text-white shadow-md shadow-brand/25 hover:brightness-110">
                <span className="sm:hidden">S'inscrire</span><span className="hidden sm:inline">Créer un compte</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
