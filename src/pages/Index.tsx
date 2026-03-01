import React, { useState, useEffect, useCallback, useRef } from "react";
import { Shield, Zap, Headphones, Lock, Star } from "lucide-react";
import logo from "@/assets/logo.png";
import SpinWheel from "@/components/SpinWheel";
import Confetti from "@/components/Confetti";
import AmbientParticles from "@/components/AmbientParticles";
import SocialProofTicker from "@/components/SocialProofTicker";
import LiveCounter from "@/components/LiveCounter";
import ScarcityBar from "@/components/ScarcityBar";
import WinnerToast from "@/components/WinnerToast";
import SuspenseOverlay from "@/components/SuspenseOverlay";
import { playWinSound, playDrumroll } from "@/lib/sounds";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FunnelStep = "hero" | "result" | "claim" | "expired";

const WHATSAPP_NUMBER = "59899999999";
const WHATSAPP_MESSAGE = "Hola, quiero activar mi bono de bienvenida.";
const BONUS_TIMER = 300;

const TRUST_BADGES = [
  { icon: Shield, label: "Plataforma verificada" },
  { icon: Zap, label: "Pagos instantáneos" },
  { icon: Headphones, label: "Soporte 24/7" },
];

const GAMES = [
  { emoji: "🎰", label: "Slots" },
  { emoji: "🎡", label: "Ruleta" },
  { emoji: "🃏", label: "Blackjack" },
  { emoji: "🎲", label: "Dados" },
];

const BRAND_NAME = "Smart Play";

const Index = () => {
  const [step, setStep] = useState<FunnelStep>(() => {
    if (localStorage.getItem("casino_expired")) return "expired";
    return localStorage.getItem("casino_spun") ? "result" : "hero";
  });
  const [result, setResult] = useState<string>(
    localStorage.getItem("casino_result") || ""
  );
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [showShake, setShowShake] = useState(false);
  const [showSuspense, setShowSuspense] = useState(false);
  const [pendingPrize, setPendingPrize] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [countdown, setCountdown] = useState(BONUS_TIMER);
  const [recentClaims] = useState(() => Math.floor(Math.random() * 8) + 12);
  const phoneRef = useRef<HTMLInputElement>(null);

  const hasSpun = !!localStorage.getItem("casino_spun");

  const handleSpinComplete = useCallback((prize: string) => {
    setPendingPrize(prize);
    playDrumroll();
    setShowSuspense(true);
  }, []);

  const handleSuspenseComplete = useCallback(() => {
    if (!pendingPrize) return;
    setShowSuspense(false);
    localStorage.setItem("casino_spun", "true");
    localStorage.setItem("casino_result", pendingPrize);
    setResult(pendingPrize);
    playWinSound();
    setShowConfetti(true);
    setShowFlash(true);
    setShowShake(true);
    setTimeout(() => setShowFlash(false), 600);
    setTimeout(() => setShowShake(false), 700);
    setTimeout(() => setStep("result"), 300);
    setTimeout(() => setShowConfetti(false), 6000);
    setPendingPrize(null);
  }, [pendingPrize]);

  const handleClaim = () => {
    setStep("claim");
    setTimeout(() => phoneRef.current?.focus(), 400);
  };

  const handleRetry = () => {
    localStorage.removeItem("casino_spun");
    localStorage.removeItem("casino_result");
    localStorage.removeItem("casino_expired");
    setStep("hero");
    setResult("");
    setCountdown(BONUS_TIMER);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `${WHATSAPP_MESSAGE} Mi bono: ${result}. Teléfono: ${phone}${name ? `. Nombre: ${name}` : ""}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  useEffect(() => {
    if (step !== "result" && step !== "claim") return;
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          localStorage.setItem("casino_expired", "true");
          setStep("expired");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const isUrgent = countdown < 60;

  return (
    <div className={`min-h-screen casino-gradient relative overflow-x-hidden ${showShake ? 'screen-shake' : ''}`}>
      <AmbientParticles />
      {showConfetti && <Confetti />}
      {showSuspense && <SuspenseOverlay onComplete={handleSuspenseComplete} />}
      {showFlash && (
        <div className="fixed inset-0 bg-casino-gold/30 z-50 pointer-events-none screen-flash" />
      )}
      <WinnerToast />

      {/* Top decorative line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-casino-gold/40 to-transparent" />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center px-5 pt-10 pb-8 text-center max-w-lg mx-auto">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2.5 mb-6">
          <img src={logo} alt="Smart Play" className="w-10 h-10 rounded-xl shadow-lg object-cover" />
          <span className="text-xl font-black tracking-tight gold-text">{BRAND_NAME}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black leading-[1.1] mb-3 gold-text max-w-md tracking-tight">
          Girá la ruleta y desbloqueá tu bono exclusivo
        </h1>
        <p className="text-muted-foreground text-sm mb-4 max-w-xs">
          Más de <span className="font-semibold text-foreground">10.000+</span> jugadores activos ganando todos los días
        </p>

        <LiveCounter />

        {/* Trust Badges */}
        <div className="flex gap-2.5 mb-8 flex-wrap justify-center">
          {TRUST_BADGES.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 glass-card rounded-full px-3.5 py-2 text-xs text-foreground/80 premium-shadow"
            >
              <Icon className="w-3.5 h-3.5 text-casino-gold" />
              {label}
            </div>
          ))}
        </div>

        {/* === HERO: Spin Wheel === */}
        {step === "hero" && (
          <div className="flex flex-col items-center">
            <SpinWheel onSpinComplete={handleSpinComplete} disabled={hasSpun} />
            {!hasSpun && (
              <p className="mt-5 text-sm text-muted-foreground">
                Tenés <span className="font-bold text-casino-gold">1 giro gratis</span> disponible
              </p>
            )}
            <ScarcityBar />
          </div>
        )}

        {/* === RESULT: Victory Section === */}
        {step === "result" && (
          <div className="flex flex-col items-center gap-4 w-full max-w-sm relative victory-entrance">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 radial-burst" />

            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="sparkle"
                style={{
                  top: `${10 + Math.random() * 60}%`,
                  left: `${5 + Math.random() * 90}%`,
                  animation: `sparkle ${1 + Math.random()}s ease-in-out ${0.3 + i * 0.2}s infinite`,
                  width: 5 + Math.random() * 10,
                  height: 5 + Math.random() * 10,
                }}
              />
            ))}

            <div className="text-7xl emoji-celebrate">🎉</div>
            
            <div className="glass-card-strong rounded-2xl p-6 w-full stagger-1 victory-card-glow">
              <h2 className="text-xl sm:text-2xl font-black text-foreground uppercase tracking-wide mb-1">
                ¡Felicitaciones!
              </h2>
              <p className="text-sm text-muted-foreground mb-4">Ganaste un bono de bienvenida de</p>
              
              <div className="relative">
                <span className="block text-7xl sm:text-8xl font-black glow-text tracking-tight leading-none bonus-number-reveal">
                  {result}
                </span>
                <span className="block text-base font-bold text-muted-foreground mt-3 uppercase tracking-[0.2em]">
                  Bono de Bienvenida
                </span>
              </div>
            </div>

            <div className="glass-card rounded-xl px-4 py-2.5 stagger-2">
              <p className="text-xs text-muted-foreground">
                ⭐ Solo <span className="font-bold text-casino-gold">3 de cada 100</span> jugadores reciben este bono
              </p>
            </div>

            <div className="flex flex-col items-center gap-1.5 stagger-3">
              <span className="text-xs text-muted-foreground">Tu bono está reservado durante:</span>
              <span className={`font-mono font-bold text-2xl px-5 py-1.5 rounded-xl ${isUrgent ? 'countdown-urgent bg-destructive/15' : 'text-casino-gold glass-card'}`}>
                {formatTime(countdown)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-destructive font-semibold animate-pulse stagger-3">
              <span>⚠️</span>
              <span>Oferta válida por tiempo limitado</span>
            </div>

            <Button
              onClick={handleClaim}
              className="mt-1 w-full max-w-xs py-7 text-xl font-black rounded-full gold-gradient text-primary-foreground pulse-glow uppercase tracking-wide bounce-cta stagger-4"
            >
              🎁 Reclamar mi bono
            </Button>
          </div>
        )}

        {/* === CLAIM: Form === */}
        {step === "claim" && (
          <div className="w-full max-w-sm animate-in slide-in-from-bottom-4 duration-500">
            <div className="glass-card-strong rounded-2xl p-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-full gold-gradient text-primary-foreground text-xs font-bold flex items-center justify-center shadow-md">✓</span>
                <div className="w-8 h-0.5 bg-casino-gold/50" />
                <span className="w-7 h-7 rounded-full gold-border text-casino-gold text-xs font-bold flex items-center justify-center">2</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Paso 2 de 2 — Solo falta tu número</p>

              <h2 className="text-xl font-black text-foreground mb-1">
                Activá tu bono de <span className="text-casino-gold">{result}</span>
              </h2>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-xs text-muted-foreground">Expira en</span>
                <span className={`font-mono font-bold text-sm px-2.5 py-1 rounded-lg ${isUrgent ? 'countdown-urgent bg-destructive/15' : 'text-casino-gold glass-card'}`}>
                  {formatTime(countdown)}
                </span>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <Input
                  ref={phoneRef}
                  type="tel"
                  placeholder="Tu número de teléfono *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="bg-muted/40 border-border/50 text-foreground placeholder:text-muted-foreground h-12 text-base rounded-xl"
                />
                <Input
                  type="text"
                  placeholder="Tu nombre (opcional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-muted/40 border-border/50 text-foreground placeholder:text-muted-foreground h-12 text-base rounded-xl"
                />
                <Button
                  type="submit"
                  disabled={!phone}
                  className="w-full py-6 text-lg font-black rounded-full gold-gradient text-primary-foreground pulse-glow uppercase tracking-wide disabled:opacity-40"
                >
                  Reclamar mi bono ahora
                </Button>
              </form>

              <div className="flex items-center justify-center gap-1.5 mt-4 text-[11px] text-muted-foreground/60">
                <Lock className="w-3 h-3" />
                <span>Tu información es 100% confidencial</span>
              </div>
              <p className="text-[11px] text-muted-foreground/60 mt-2 text-center">
                🔥 {recentClaims} personas activaron su bono en los últimos 10 minutos
              </p>
            </div>
          </div>
        )}

        {/* === EXPIRED === */}
        {step === "expired" && (
          <div className="flex flex-col items-center gap-4 animate-in fade-in-0 duration-500">
            <div className="text-6xl">⏰</div>
            <h2 className="text-xl font-black text-foreground">El bono expiró</h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              Tu bono de <span className="font-bold text-casino-gold">{result}</span> ya no está disponible.
              Girá nuevamente para intentar obtener otro.
            </p>
            <Button
              onClick={handleRetry}
              className="mt-2 px-8 py-5 text-lg font-black rounded-full gold-gradient text-primary-foreground pulse-glow uppercase"
            >
              🎰 Girar nuevamente
            </Button>
          </div>
        )}
      </section>

      {/* Divider */}
      <div className="h-px w-4/5 mx-auto bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Social Proof */}
      <section className="relative z-10 px-5 py-8 max-w-lg mx-auto">
        <h3 className="text-center text-xs font-bold text-muted-foreground uppercase tracking-[0.25em] mb-4">
          Ganadores recientes
        </h3>
        <SocialProofTicker />

        {/* Game thumbnails */}
        <div className="flex justify-center gap-4 mt-8">
          {GAMES.map(({ emoji, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center text-3xl premium-shadow group-hover:scale-105 transition-transform duration-200">
                {emoji}
              </div>
              <span className="text-[11px] text-muted-foreground font-medium">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="h-px w-4/5 mx-auto bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Footer */}
      <footer className="relative z-10 px-5 py-10 max-w-lg mx-auto text-center">
        {/* Payment methods */}
        <div className="mb-6">
          <p className="text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em] mb-3">Métodos de pago aceptados</p>
          <div className="flex justify-center gap-3 flex-wrap">
            {["💳 Visa", "💳 Mastercard", "📱 MercadoPago", "🏦 Transferencia"].map((method) => (
              <span key={method} className="text-[11px] text-muted-foreground/60 glass-card rounded-md px-2.5 py-1.5">
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Responsible gaming */}
        <div className="glass-card rounded-xl px-4 py-3 mb-6 inline-block">
          <p className="text-[11px] text-muted-foreground/60 flex items-center gap-1.5">
            🔞 Jugá con responsabilidad — Solo para mayores de 18 años
          </p>
        </div>

        {/* Legal links */}
        <div className="flex justify-center gap-4 mb-4 flex-wrap">
          {["Términos y condiciones", "Política de privacidad", "Juego responsable", "Contacto"].map((link) => (
            <a key={link} href="#" className="text-[10px] text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors underline-offset-2 hover:underline">
              {link}
            </a>
          ))}
        </div>

        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src={logo} alt="Smart Play" className="w-6 h-6 rounded-md object-cover" />
          <span className="text-sm font-bold gold-text">{BRAND_NAME}</span>
        </div>
        <p className="text-[10px] text-muted-foreground/30">
          © {new Date().getFullYear()} {BRAND_NAME}. Todos los derechos reservados.
        </p>
        <p className="text-[9px] text-muted-foreground/20 mt-1">
          Los bonos están sujetos a términos y condiciones. Aplican requisitos de apuesta.
        </p>
      </footer>

      <div className="h-24" />

      {/* Sticky WhatsApp CTA */}
      {step !== "claim" && step !== "expired" && (
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`fixed bottom-4 left-4 right-4 z-40 flex items-center justify-center gap-2 py-4 rounded-2xl bg-[hsl(142,70%,38%)] text-white font-bold text-base shadow-[0_4px_24px_hsl(142_70%_38%/0.4)] active:scale-95 transition-all duration-200 max-w-lg mx-auto ${step === "result" ? "bounce-cta" : ""}`}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.917.918l4.458-1.495A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.395 0-4.612-.756-6.432-2.039l-.448-.334-2.648.888.888-2.648-.334-.448A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
          </svg>
          {step === "result" ? "⚡ Reclamar mi bono ahora" : "Hablar con un asesor"}
        </a>
      )}
    </div>
  );
};

export default Index;
