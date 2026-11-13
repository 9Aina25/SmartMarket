import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { IconCircleCheck, IconCircleX, IconAlert, IconInfo, IconX } from "../components/Icons";

const ToastContext = createContext(null);
let compteur = 0;

const STYLES = {
  success: { Icone: IconCircleCheck, bande: "bg-emerald-500", icone: "text-emerald-600", defaut: "Succès" },
  error: { Icone: IconCircleX, bande: "bg-red-500", icone: "text-red-600", defaut: "Erreur" },
  warning: { Icone: IconAlert, bande: "bg-amber-500", icone: "text-amber-600", defaut: "Attention" },
  info: { Icone: IconInfo, bande: "bg-brand", icone: "text-brand", defaut: "Information" },
};

function Toast({ toast, fermer }) {
  const [pause, setPause] = useState(false);
  const { Icone, bande, icone, defaut } = STYLES[toast.type];
  return (
    <div
      role={toast.type === "error" ? "alert" : "status"}
      className="toast-in pointer-events-auto relative w-full overflow-hidden rounded-xl border border-ink/10 bg-white shadow-xl shadow-ink/10"
      onMouseEnter={() => setPause(true)}
      onMouseLeave={() => setPause(false)}
    >
      <div className="flex items-start gap-3 p-4 pr-3">
        <Icone width={22} height={22} className={`mt-0.5 shrink-0 ${icone}`} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{toast.titre || defaut}</p>
          {toast.message && <p className="mt-0.5 text-sm text-ink/65">{toast.message}</p>}
          {toast.action && (
            <button
              onClick={() => { toast.action.onClick(); fermer(toast.id); }}
              className="mt-2 text-sm font-semibold text-brand hover:underline"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        <button onClick={() => fermer(toast.id)} aria-label="Fermer la notification" className="rounded-md p-1 text-ink/40 hover:bg-ink/5 hover:text-ink/70">
          <IconX width={16} height={16} />
        </button>
      </div>
      {/* Barre de temps : la notification disparaît à la fin de l'animation ; survol = pause */}
      <span
        className={`absolute inset-x-0 bottom-0 h-1 origin-left ${bande}`}
        style={{ animation: `toast-progress ${toast.duree}ms linear forwards`, animationPlayState: pause ? "paused" : "running" }}
        onAnimationEnd={() => fermer(toast.id)}
      />
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const fermer = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const ajouter = useCallback((type, message, options = {}) => {
    const id = ++compteur;
    const duree = options.duree ?? (type === "error" ? 7000 : 5000);
    setToasts((t) => [...t.slice(-3), { id, type, message, duree, titre: options.titre, action: options.action }]);
    return id;
  }, []);

  const toast = useMemo(
    () => ({
      success: (m, o) => ajouter("success", m, o),
      error: (m, o) => ajouter("error", m, o),
      warning: (m, o) => ajouter("warning", m, o),
      info: (m, o) => ajouter("info", m, o),
      fermer,
    }),
    [ajouter, fermer]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-4 z-50 mx-auto flex w-full max-w-sm flex-col gap-3 px-4 sm:inset-x-auto sm:right-4 sm:mx-0 sm:px-0">
        {toasts.map((t) => <Toast key={t.id} toast={t} fermer={fermer} />)}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
