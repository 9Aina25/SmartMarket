import { IconCheck } from "./Icons";

/** Indicateur d'étapes : `current` commence à 1. */
export default function Stepper({ steps, current }) {
  return (
    <ol className="mb-6 flex items-center" aria-label="Progression">
      {steps.map((label, i) => {
        const n = i + 1;
        const fait = n < current;
        const actif = n === current;
        return (
          <li key={label} className="flex flex-1 items-center last:flex-none" aria-current={actif ? "step" : undefined}>
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                fait ? "bg-brand text-white" : actif ? "bg-brand/10 text-brand ring-2 ring-brand" : "bg-ink/8 text-ink/45"
              }`}
            >
              {fait ? <IconCheck width={14} height={14} strokeWidth={3} /> : n}
            </span>
            <span className={`ml-2 text-xs font-medium ${actif ? "text-ink" : "text-ink/50"}`}>{label}</span>
            {n < steps.length && <span className={`mx-3 h-0.5 flex-1 rounded ${fait ? "bg-brand" : "bg-ink/10"}`} />}
          </li>
        );
      })}
    </ol>
  );
}
