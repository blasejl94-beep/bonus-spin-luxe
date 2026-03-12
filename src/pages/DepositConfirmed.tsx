import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { track } from "@/lib/tracking";
import logoIcon from "@/assets/logo-icon.png";

/**
 * Fallback redirect when no `redirect` URL param is provided.
 * Change this to the casino / cashier URL when ready.
 */
const DEFAULT_REDIRECT = "https://smartplay2.lovable.app";

/**
 * Allowed redirect origins. Only URLs matching these are accepted;
 * anything else falls back to DEFAULT_REDIRECT.
 */
const ALLOWED_REDIRECT_ORIGINS = [
  "https://smartplay2.lovable.app",
  // Add future casino / cashier domains here:
  // "https://casino.example.com",
];

function getSafeRedirect(raw: string | null): string {
  if (!raw) return DEFAULT_REDIRECT;
  try {
    const url = new URL(raw);
    if (ALLOWED_REDIRECT_ORIGINS.some((o) => url.origin === new URL(o).origin)) {
      return raw;
    }
  } catch {
    // relative path — allow only simple paths starting with /
    if (/^\/[a-zA-Z0-9/_-]*$/.test(raw)) return raw;
  }
  return DEFAULT_REDIRECT;
}

const REDIRECT_DELAY_MS = 1500;

const DepositConfirmed = () => {
  const [searchParams] = useSearchParams();
  const fired = useRef(false);

  const type = searchParams.get("type"); // "first" | "repeat"
  const source = searchParams.get("source");
  const cashierId = searchParams.get("cashier_id");
  const amount = searchParams.get("amount");
  const redirectUrl = searchParams.get("redirect") || DEFAULT_REDIRECT;

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    const event = type === "repeat" ? "RepeatDepositConfirmed" : "FirstDepositConfirmed";
    track(event, {
      ...(source && { source }),
      ...(cashierId && { cashier_id: cashierId }),
      ...(amount && { amount }),
    });

    const timer = setTimeout(() => {
      window.location.href = redirectUrl;
    }, REDIRECT_DELAY_MS);

    return () => clearTimeout(timer);
  }, [type, source, cashierId, amount, redirectUrl]);

  return (
    <div className="min-h-screen casino-gradient flex items-center justify-center px-5">
      <div className="flex flex-col items-center text-center gap-4 animate-in fade-in-0 zoom-in-95 duration-500">
        {/* Gold checkmark */}
        <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center shadow-[0_0_40px_hsl(var(--casino-gold)/0.35)]">
          <svg className="w-8 h-8 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-xl font-black gold-text tracking-tight">
          {type === "repeat" ? "Recarga confirmada" : "Depósito confirmado"}
        </h1>
        <p className="text-sm text-muted-foreground max-w-xs">
          Tu operación fue procesada correctamente.
        </p>

        {amount && (
          <p className="text-xs text-casino-gold font-semibold">
            Monto: ${amount}
          </p>
        )}

        <img
          src={logoIcon}
          alt="Smart Play"
          width={48}
          height={48}
          className="w-12 h-12 object-contain opacity-40 mt-4"
        />

        <p className="text-[10px] text-muted-foreground/40">Redirigiendo…</p>
      </div>
    </div>
  );
};

export default DepositConfirmed;
