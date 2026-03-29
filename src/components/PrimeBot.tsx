import type { ReactNode } from "react";

interface PrimeBotProps {
  children: ReactNode;
  /** Short label; default is PrimeBot */
  name?: string;
}

/** Friendly pedagogical agent panel (ITS-style guidance). */
export function PrimeBot({ children, name = "PrimeBot" }: PrimeBotProps) {
  return (
    <div className="primebot" role="region" aria-label={`${name} says`}>
      <div className="primebot-header">
        <span className="primebot-avatar" aria-hidden>
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="var(--accent)" strokeWidth="2" />
            <circle cx="11" cy="14" r="2" fill="var(--accent)" />
            <circle cx="21" cy="14" r="2" fill="var(--accent)" />
            <path
              d="M11 20c2 2 8 2 10 0"
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span className="primebot-name">{name}</span>
      </div>
      <div className="primebot-content">{children}</div>
    </div>
  );
}
