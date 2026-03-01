import React, { useState, useEffect, useCallback, useRef } from "react";
import { Shield, Zap, Headphones, Lock } from "lucide-react";
import SpinWheel from "@/components/SpinWheel";
import Confetti from "@/components/Confetti";
import SocialProofTicker from "@/components/SocialProofTicker";
import LiveCounter from "@/components/LiveCounter";
import ScarcityBar from "@/components/ScarcityBar";
import WinnerToast from "@/components/WinnerToast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FunnelStep = "hero" | "result" | "claim";

const WHATSAPP_NUMBER = "59899999999";
const WHATSAPP_MESSAGE = "Hola, quiero activar mi bono de bienvenida.";

const Index = () => {
  const [step, setStep] = useState<FunnelStep>(() => {
    return localStorage.getItem("casino_spun") ? "result" : "hero";
  });
  const [result, setResult] = useState<string>(
    localStorage.getItem("casino_result") || ""
  );
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [countdown, setCountdown] = useState(300);
  const [recentClaims] = useState(() => Math.floor(Math.random() * 8) + 12);
  const phoneRef = useRef<HTMLInputElement>(null);

  const hasSpun = !!localStorage.getItem("casino_spun");

  const handleSpinComplete = useCallback((prize: string) => {
    localStorage.setItem("casino_spun", "true");
    localStorage.setItem("casino_result", prize);
    setResult(prize);
    setShowConfetti(true);
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 500);
    setTimeout(() => setStep("result"), 500);
    setTimeout(() => setShowConfetti(false), 4000);
  }, []);

  const handleClaim = () => {
    setStep("claim");
    setTimeout(() => phoneRef.current?.focus(), 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `${WHATSAPP_MESSAGE} Mi bono: ${result}. Teléfono: ${phone}${name ? `. Nombre: ${name}` : ""}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  // Countdown timer
  useEffect(() => {
    if (step !== "claim") return;
    const interval = setInterval(() => {
      setCountdown((c) => (c <= 0 ? 0 : c - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const isUrgent = countdown < 60;

  // Context-aware WhatsApp CTA
  const getCtaText = () => {
    if (step === "result") return "⚡ Activar mi bono por WhatsApp";
    return "Hablar con un asesor por WhatsApp";
  };

  return (
    <div className="min-h-screen casino-gradient relative overflow-x-hidden">
      {showConfetti && <Confetti />}
      {showFlash && (
        <div className="fixed inset-0 bg-casino-gold/30 z-50 pointer-events-none screen-flash" />
      )}
      <WinnerToast />

      {/* Hero Section */}
      <section className="flex flex-col items-center px-4 pt-8 pb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-2 gold-text max-w-md">
          Girá la ruleta y desbloqueá tu bono de bienvenida
        </h1>
        <p className="text-foreground/70 text-sm mb-3">
          Más de <span className="font-bold text-foreground">10.000</span> jugadores ganando todos los días
        </p>

        <LiveCounter />

        {/* Trust Badges */}
        <div className="flex gap-4 mb-6 flex-wrap justify-center">
          {[
            { icon: Shield, label: "Plataforma verificada" },
            { icon: Zap, label: "Pagos rápidos" },
            { icon: Headphones, label: "Atención 24/7" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 bg-muted/50 rounded-full px-3 py-1.5 text-xs text-foreground/80"
            >
              <Icon className="w-3.5 h-3.5 text-casino-gold" />
              {label}
            </div>
          ))}
        </div>

        {/* Main interaction area */}
        {step === "hero" && (
          <div className="flex flex-col items-center">
            <SpinWheel onSpinComplete={handleSpinComplete} disabled={hasSpun} />
            {!hasSpun && (
              <p className="mt-4 text-sm text-foreground/60">
                Tenés <span className="font-bold text-casino-gold">1 giro</span> disponible
              </p>
            )}
            <ScarcityBar />
          </div>
        )}

        {step === "result" && (
          <div className="flex flex-col items-center gap-4 animate-in fade-in-0 zoom-in-95 duration-500">
            <div className="text-6xl mb-2">🎉</div>
            <h2 className="text-2xl font-extrabold text-foreground">¡Felicitaciones!</h2>
            <p className="text-lg text-foreground/80">
              Ganaste{" "}
              <span className="font-black text-3xl gold-text">{result}</span>{" "}
              de bono de bienvenida
            </p>
            <div className="bg-muted/30 rounded-lg px-4 py-2 mt-1">
              <p className="text-xs text-foreground/60">
                ⭐ Solo <span className="font-bold text-casino-gold">3 de cada 100</span> jugadores reciben este bono
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-destructive font-semibold animate-pulse">
              <span>⚠️</span>
              <span>Oferta válida por tiempo limitado</span>
            </div>
            <Button
              onClick={handleClaim}
              className="mt-2 px-8 py-6 text-lg font-extrabold rounded-full gold-gradient text-primary-foreground pulse-glow uppercase tracking-wide"
            >
              🎁 Reclamar mi bono
            </Button>
          </div>
        )}

        {step === "claim" && (
          <div className="w-full max-w-sm animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-card/80 backdrop-blur rounded-2xl p-6 gold-border">
              {/* Progress indicator */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-casino-gold text-primary-foreground text-xs font-bold flex items-center justify-center">✓</span>
                <div className="w-8 h-0.5 bg-casino-gold" />
                <span className="w-6 h-6 rounded-full gold-border text-casino-gold text-xs font-bold flex items-center justify-center">2</span>
              </div>
              <p className="text-xs text-foreground/50 mb-3">Paso 2 de 2 — Solo falta tu número</p>

              <h2 className="text-xl font-extrabold text-foreground mb-1">
                Activá tu bono en 10 segundos
              </h2>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-xs text-foreground/60">Tu bono está reservado por</span>
                <span className={`font-mono font-bold text-sm px-2 py-0.5 rounded ${isUrgent ? 'countdown-urgent bg-destructive/20' : 'text-casino-gold bg-muted/60'}`}>
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
                  className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground h-12 text-base"
                />
                <Input
                  type="text"
                  placeholder="Tu nombre (opcional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground h-12 text-base"
                />
                <Button
                  type="submit"
                  disabled={!phone}
                  className="w-full py-6 text-lg font-extrabold rounded-full gold-gradient text-primary-foreground pulse-glow uppercase tracking-wide disabled:opacity-40"
                >
                  Activar bono ahora
                </Button>
              </form>

              <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-foreground/40">
                <Lock className="w-3 h-3" />
                <span>Tu información es 100% confidencial</span>
              </div>
              <p className="text-[11px] text-foreground/40 mt-2 text-center">
                🔥 {recentClaims} personas activaron su bono en los últimos 10 minutos
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Social Proof */}
      <section className="px-4 py-6">
        <h3 className="text-center text-sm font-bold text-foreground/50 uppercase tracking-widest mb-3">
          Ganadores recientes
        </h3>
        <SocialProofTicker />

        {/* Game thumbnails */}
        <div className="flex justify-center gap-6 mt-6">
          {[
            { emoji: "🎰", label: "Slots" },
            { emoji: "🎡", label: "Ruleta" },
            { emoji: "🃏", label: "Blackjack" },
          ].map(({ emoji, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div className="w-16 h-16 rounded-xl bg-muted/40 gold-border flex items-center justify-center text-3xl">
                {emoji}
              </div>
              <span className="text-xs text-foreground/60">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Spacer for sticky button */}
      <div className="h-20" />

      {/* Sticky WhatsApp CTA - hidden during claim step */}
      {step !== "claim" && (
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`fixed bottom-4 left-4 right-4 z-40 flex items-center justify-center gap-2 py-4 rounded-full bg-[hsl(142,70%,40%)] text-white font-bold text-base shadow-lg active:scale-95 transition-transform ${step === "result" ? "bounce-cta" : ""}`}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.917.918l4.458-1.495A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.395 0-4.612-.756-6.432-2.039l-.448-.334-2.648.888.888-2.648-.334-.448A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
          </svg>
          {getCtaText()}
        </a>
      )}
    </div>
  );
};

export default Index;
