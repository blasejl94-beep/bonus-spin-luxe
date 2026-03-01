import React, { useEffect, useState } from "react";

const NAMES = ["Valentina", "Gonzalo", "Felipe", "Camila", "Martín", "Lucía", "Santiago", "Florencia", "Mateo", "Sofía"];
const CITIES = ["Montevideo", "Punta del Este", "Salto", "Colonia", "Maldonado", "Rivera", "Paysandú"];
const AMOUNTS = [15000, 22000, 8500, 45000, 31000, 12000, 67000, 19500, 28000, 55000];

const WinnerToast: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [winner, setWinner] = useState({ name: "", city: "", amount: 0, time: "" });

  useEffect(() => {
    const show = () => {
      const times = ["hace 1 min", "hace 2 min", "hace 30 seg", "ahora mismo", "hace 5 min"];
      setWinner({
        name: NAMES[Math.floor(Math.random() * NAMES.length)],
        city: CITIES[Math.floor(Math.random() * CITIES.length)],
        amount: AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)],
        time: times[Math.floor(Math.random() * times.length)],
      });
      setVisible(true);
      setTimeout(() => setVisible(false), 4000);
    };

    const initial = setTimeout(show, 5000);
    const interval = setInterval(show, 8000 + Math.random() * 4000);
    return () => { clearTimeout(initial); clearInterval(interval); };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 left-4 z-50 max-w-[280px] animate-in slide-in-from-left-5 fade-in-0 duration-300">
      <div className="bg-card border border-border rounded-xl p-3 shadow-lg">
        <div className="flex items-start gap-2">
          <span className="text-lg mt-0.5">🏆</span>
          <div className="text-xs">
            <p className="text-foreground font-semibold">
              {winner.name} de {winner.city}
            </p>
            <p className="text-muted-foreground">
              acaba de ganar{" "}
              <span className="font-bold text-casino-gold">{winner.amount.toLocaleString("es-UY")} UYU</span>
            </p>
            <p className="text-muted-foreground/60 text-[10px] mt-0.5">{winner.time}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinnerToast;
