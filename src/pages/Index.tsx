import React, { useState, useEffect, useCallback, useRef } from "react";
import { Shield, Zap, Headphones, Lock, Star } from "lucide-react";
import logo from "@/assets/logo.png";
import SpinWheel from "@/components/SpinWheel";
import Confetti from "@/components/Confetti";
import PrizeTicket from "@/components/PrizeTicket";
import AmbientParticles from "@/components/AmbientParticles";
import SocialProofTicker from "@/components/SocialProofTicker";
import LiveCounter from "@/components/LiveCounter";
import ScarcityBar from "@/components/ScarcityBar";
import WinnerToast from "@/components/WinnerToast";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type FunnelStep = "hero" | "result" | "claim" | "expired";

const WHATSAPP_NUMBER = "59894619935";
const WHATSAPP_MSG_NO_SPIN = `Hola!\n\nQuiero activar mi bono de bienvenida para empezar a jugar.\n\n¿Me decís la carga mínima y los medios de pago disponibles?`;

const BONUS_TIMER = 300;

const TRUST_BADGES = [
  { icon: Shield, label: "Plataforma verificada" },
  { icon: Zap, label: "Pagos instantáneos" },
  { icon: Headphones, label: "Soporte 24/7" },
];

const GAMES = [
  { emoji: "🎰" },
  { emoji: "🎡" },
  { emoji: "🃏" },
  { emoji: "🎲" },
];

const PAYMENT_METHODS = [
  { name: "Abitab", icon: "🏪" },
  { name: "Redpagos", icon: "🏬" },
  { name: "MercadoPago", icon: "💳" },
  { name: "Prex", icon: "📱" },
  { name: "MiDinero", icon: "💰" },
  { name: "Santander", icon: "🏦" },
  { name: "eBrou", icon: "🏛️" },
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
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [countdown, setCountdown] = useState(BONUS_TIMER);
  const [recentClaims] = useState(() => Math.floor(Math.random() * 8) + 12);
  const phoneRef = useRef<HTMLInputElement>(null);

  const hasSpun = !!localStorage.getItem("casino_spun");

  const handleRevealComplete = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 6000);
  }, []);

  const handleSpinComplete = useCallback((prize: string) => {
    localStorage.setItem("casino_spun", "true");
    localStorage.setItem("casino_result", prize);
    setResult(prize);
    setShowFlash(true);
    setShowShake(true);
    setTimeout(() => setShowFlash(false), 600);
    setTimeout(() => setShowShake(false), 700);
    setTimeout(() => setStep("result"), 500);
  }, []);

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
      `Hola!\n\nQuiero activar mi bono de bienvenida para empezar a jugar.\n\nBono obtenido: ${result}\n\n¿Me decís la carga mínima y los medios de pago disponibles?`
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

  const [countGlow, setCountGlow] = useState(0);

  return (
    <div className={`min-h-screen casino-gradient relative overflow-x-hidden ${showShake ? 'screen-shake' : ''}`}>
      <AmbientParticles />
      {showConfetti && <Confetti />}
      {showFlash && (
        <div className="fixed inset-0 bg-casino-gold/30 z-50 pointer-events-none screen-flash" />
      )}

      <WinnerToast />

      <div className="h-px w-full bg-gradient-to-r from-transparent via-casino-gold/40 to-transparent" />

      <section className="relative z-10 flex flex-col items-center px-5 pt-6 pb-8 text-center max-w-lg mx-auto">
        <div className="flex items-center justify-center mb-3">
          <img src={logo} alt="Smart Play" className="w-24 h-24 object-contain drop-shadow-[0_0_20px_hsl(var(--casino-gold)/0.4)]" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black leading-[1.1] mb-2 max-w-md tracking-tight">
          <span className="inline-block" style={{ WebkitBackgroundClip: 'unset', backgroundClip: 'unset', WebkitTextFillColor: 'unset' }}>🎰</span>{' '}
          <span className="gold-text">Girá la rueda y desbloqueá tu bono exclusivo</span>
        </h1>
        <p className="text-muted-foreground text-xs mb-3 max-w-xs">
          Más de <span className="font-semibold text-foreground">10.000</span> jugadores ya reclamaron su bono
        </p>

        {step === "hero" && (
          <div className="flex flex-col items-center">
            <SpinWheel onSpinComplete={handleSpinComplete} disabled={hasSpun} />
            {!hasSpun && (
              <p className="mt-4 text-sm text-muted-foreground">
                🎰 Tenés <span className="font-bold text-casino-gold">1 giro</span> para desbloquear tu bono
              </p>
            )}
            <ScarcityBar />
          </div>
        )}

        {step !== "result" && (
          <>
            <div className="flex gap-2 mt-5 mb-4 flex-wrap justify-center">
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1 glass-card rounded-full px-2.5 py-1.5 text-[10px] text-foreground/60">
                  <Icon className="w-3 h-3 text-casino-gold/80" />
                  {label}
                </div>
              ))}
            </div>
            <LiveCounter />
          </>
        )}

        {step === "result" && (
          <div className="flex flex-col items-center gap-4 w-full max-w-sm relative prize-entrance">
            <PrizeTicket
              result={result || "200%"}
              onRevealComplete={handleRevealComplete}
              countdownText={formatTime(countdown)}
              isUrgent={isUrgent}
              onCountProgress={(p) => {
                setCountGlow(p);
                if (p >= 1) {
                  setTimeout(() => setCountGlow(0), 1500);
                }
              }}
            />

            <div className="glass-card rounded-xl px-4 py-2.5 stagger-3">
              <p className="text-xs text-muted-foreground">
                ⭐ Solo <span className="font-bold text-casino-gold">3 de cada 100</span> jugadores reciben este bono
              </p>
            </div>


            <div className="flex items-center gap-2 text-xs text-destructive font-semibold animate-pulse stagger-3">
              <span>⚠️</span>
              <span>Oferta válida por tiempo limitado</span>
            </div>

            <Button
              onClick={handleClaim}
              className="mt-2 w-full max-w-xs py-8 text-2xl font-black rounded-2xl gold-gradient text-white uppercase tracking-wide bounce-cta stagger-4 relative overflow-hidden shadow-[0_0_40px_hsl(42,100%,50%,0.5),0_0_80px_hsl(42,100%,50%,0.2)] hover:shadow-[0_0_60px_hsl(42,100%,50%,0.7),0_0_100px_hsl(42,100%,50%,0.3)] hover:scale-[1.03] active:scale-95 transition-all duration-300 border-2 border-casino-gold/60"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              🎁 RECLAMAR MI BONO
            </Button>

            <p className="text-xs text-muted-foreground stagger-4 mt-3">
              💬 Activación en menos de 1 minuto
            </p>
          </div>
        )}

        {step === "claim" && (
          <div className="w-full max-w-sm animate-in slide-in-from-bottom-4 duration-500">
            <div className="glass-card-strong rounded-2xl p-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-full gold-gradient text-primary-foreground text-xs font-bold flex items-center justify-center shadow-md">✓</span>
                <div className="w-8 h-0.5 bg-casino-gold/50" />
                <span className="w-7 h-7 rounded-full gold-border text-casino-gold text-xs font-bold flex items-center justify-center">2</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">✔ Paso 1 completado — Activá tu bono</p>

              <h2 className="text-xl font-black text-foreground mb-1">
                🎁 Tu bono de <span className="text-casino-gold">{result}</span> está listo
              </h2>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-xs text-muted-foreground">Tu bono expira en</span>
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
                  className="w-full py-5 text-lg font-black rounded-xl gold-gradient text-primary-foreground uppercase tracking-wide disabled:opacity-40 relative overflow-hidden shadow-[0_0_30px_hsl(42,100%,50%,0.4)] hover:shadow-[0_0_50px_hsl(42,100%,50%,0.6)] hover:scale-[1.02] active:scale-95 transition-all duration-300 border border-casino-gold/50"
                >
                   <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                   ACTIVAR BONO AHORA
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
              🎰 GIRAR DE NUEVO
            </Button>
          </div>
        )}
      </section>

      <div className="h-px w-4/5 mx-auto bg-gradient-to-r from-transparent via-border to-transparent" />

      <section className="relative z-10 px-5 py-8 max-w-lg mx-auto">
        <h3 className="text-center text-xs font-bold text-muted-foreground uppercase tracking-[0.25em] mb-1">
          🎉 Ganadores recientes
        </h3>
        <div className="mb-4" />
        <SocialProofTicker />
        <div className="flex justify-center gap-4 mt-8">
          {GAMES.map(({ emoji }, i) => (
            <div key={i} className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center text-3xl premium-shadow hover:scale-105 transition-transform duration-200 cursor-pointer">
              {emoji}
            </div>
          ))}
        </div>
      </section>

      <div className="h-px w-4/5 mx-auto bg-gradient-to-r from-transparent via-border to-transparent" />

      <footer className="relative z-10 px-5 py-10 max-w-lg mx-auto text-center">
        <div className="mb-6">
          <p className="text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em] mb-3">Métodos de pago aceptados</p>
          <div className="flex justify-center gap-2 flex-wrap">
            {PAYMENT_METHODS.map(({ name, icon }) => (
              <span key={name} className="text-[11px] text-muted-foreground/70 glass-card rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                <span className="text-sm">{icon}</span>
                {name}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl px-4 py-3 mb-6 inline-block">
          <p className="text-[11px] text-muted-foreground/60 flex items-center gap-1.5">
            🔞 Jugá con responsabilidad — Solo para mayores de 18 años
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-4 flex-wrap">
          <Link to="/terminos" className="text-[10px] text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors underline-offset-2 hover:underline">Términos y condiciones</Link>
          <Link to="/privacidad" className="text-[10px] text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors underline-offset-2 hover:underline">Política de privacidad</Link>
          <Link to="/juego-responsable" className="text-[10px] text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors underline-offset-2 hover:underline">Juego responsable</Link>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors underline-offset-2 hover:underline">Contacto</a>
        </div>

        <div className="flex items-center justify-center mb-2">
          <img src={logo} alt="Smart Play" className="w-20 h-20 object-contain" />
        </div>
        <p className="text-[10px] text-muted-foreground/30">
          © {new Date().getFullYear()} {BRAND_NAME}. Todos los derechos reservados.
        </p>
        <p className="text-[9px] text-muted-foreground/20 mt-1">
          Los bonos están sujetos a términos y condiciones. Aplican requisitos de apuesta.
        </p>
      </footer>

      <div className="h-24" />

      {step !== "claim" && step !== "expired" && (
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(result ? `Hola!\n\nQuiero activar mi bono de bienvenida para empezar a jugar.\n\nBono obtenido: ${result}\n\n¿Me decís la carga mínima y los medios de pago disponibles?` : WHATSAPP_MSG_NO_SPIN)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`fixed bottom-4 left-4 right-4 z-40 flex items-center justify-center gap-2 py-4 rounded-2xl bg-[hsl(142,70%,38%)] text-white font-bold text-base shadow-[0_4px_24px_hsl(142_70%_38%/0.4)] active:scale-95 transition-all duration-200 max-w-lg mx-auto ${step === "result" ? "bounce-cta" : ""}`}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.917.918l4.458-1.495A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.395 0-4.612-.756-6.432-2.039l-.448-.334-2.648.888.888-2.648-.334-.448A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
          </svg>
          {step === "result" ? "⚡ Activar mi bono ahora" : "Hablar con un asesor"}
        </a>
      )}
    </div>
  );
};

export default Index;
