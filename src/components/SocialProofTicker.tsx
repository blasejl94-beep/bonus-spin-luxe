import React from "react";

const NAMES = ["Valentina", "Gonzalo", "Felipe", "Camila", "Martín", "Lucía", "Santiago", "Florencia", "Mateo", "Sofía", "Nicolás", "Agustina", "Joaquín", "María", "Tomás"];
const CITIES = ["Montevideo", "Punta del Este", "Salto", "Colonia", "Maldonado", "Rivera", "Paysandú", "Las Piedras"];
const ACTIONS = ["acaba de ganar", "acaba de ganar", "acaba de retirar"];
const TIMES = ["hace 1 min", "hace 2 min", "hace 30 seg", "ahora", "hace 5 min", "hace 3 min"];
const AVATARS = ["🧑", "👩", "👨", "👩‍🦰", "🧔", "👱‍♀️", "👨‍🦱", "👩‍🦳"];

const generateWinners = () =>
  Array.from({ length: 20 }, (_, i) => ({
    id: i,
    name: NAMES[Math.floor(Math.random() * NAMES.length)],
    city: CITIES[Math.floor(Math.random() * CITIES.length)],
    action: ACTIONS[Math.floor(Math.random() * ACTIONS.length)],
    amount: (Math.floor(Math.random() * 90) + 5) * 1000 + Math.floor(Math.random() * 999),
    time: TIMES[Math.floor(Math.random() * TIMES.length)],
    avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
  }));

const winners = generateWinners();

const SocialProofTicker: React.FC = React.memo(() => {
  return (
    <div className="w-full overflow-hidden h-48 relative rounded-xl">
      <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-background to-transparent z-10" />
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background to-transparent z-10" />
      <div className="ticker-scroll">
        {[...winners, ...winners].map((w, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-2.5 px-4 hover:bg-muted/20 transition-colors rounded-lg"
          >
            <div className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-base flex-shrink-0">
              {w.avatar}
            </div>
            <span className="text-foreground/90 text-sm flex-1 leading-snug">
              <span className="font-semibold text-foreground">{w.name}</span>
              <span className="text-muted-foreground"> de {w.city}</span>{" "}
              <span className="text-muted-foreground">{w.action}</span>{" "}
              <span className="font-bold text-casino-gold">{w.amount.toLocaleString("es-UY")} UYU</span>
            </span>
            <span className="text-[10px] text-muted-foreground/50 whitespace-nowrap">{w.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

SocialProofTicker.displayName = "SocialProofTicker";
export default SocialProofTicker;
