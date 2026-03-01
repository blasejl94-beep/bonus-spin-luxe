import React from "react";

const NAMES = ["Valentina", "Gonzalo", "Felipe", "Camila", "Martín", "Lucía", "Santiago", "Florencia", "Mateo", "Sofía", "Nicolás", "Agustina", "Joaquín", "María", "Tomás"];
const ACTIONS = ["acaba de ganar", "acaba de ganar", "acaba de retirar"];

const generateWinners = () =>
  Array.from({ length: 20 }, (_, i) => ({
    id: i,
    name: NAMES[Math.floor(Math.random() * NAMES.length)],
    action: ACTIONS[Math.floor(Math.random() * ACTIONS.length)],
    amount: (Math.floor(Math.random() * 90) + 5) * 1000 + Math.floor(Math.random() * 999),
  }));

const winners = generateWinners();

const SocialProofTicker: React.FC = () => {
  return (
    <div className="w-full overflow-hidden h-48 relative">
      <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background to-transparent z-10" />
      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background to-transparent z-10" />
      <div className="ticker-scroll">
        {[...winners, ...winners].map((w, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-2 px-4"
          >
            <span className="text-casino-gold text-lg">🏆</span>
            <span className="text-foreground/90 text-sm">
              <span className="font-semibold text-foreground">{w.name}</span>{" "}
              {w.action}{" "}
              <span className="font-bold text-casino-gold">{w.amount.toLocaleString("es-UY")} UYU</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialProofTicker;
