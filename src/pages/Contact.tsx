import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const BRAND = "Smart Play";
const WHATSAPP_NUMBER = "59894619935";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola! Necesito ayuda con mi cuenta en Smart Play.")}`;

const Contact = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.open(WHATSAPP_URL, "_blank");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen casino-gradient text-foreground flex flex-col">
      <div className="max-w-md mx-auto px-5 py-10 flex-1 flex flex-col items-center justify-center text-center">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 self-start">
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </Link>

        <Link to="/"><img src={logo} alt={BRAND} className="w-20 h-20 object-contain mb-6" /></Link>

        <h1 className="text-2xl font-black gold-text mb-3">Contacto</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Redirigiendo a WhatsApp...
        </p>

        <div className="glass-card-strong rounded-2xl p-6 w-full">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(142,70%,38%)]/20 mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-[hsl(142,70%,38%)]" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">Atención al Cliente</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Nuestro equipo está disponible 24/7 para ayudarte con cualquier consulta.
          </p>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <Button className="w-full py-5 text-base font-bold rounded-xl bg-[hsl(142,70%,38%)] hover:bg-[hsl(142,70%,32%)] text-white">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current mr-2">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.75.75 0 00.917.918l4.458-1.495A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.395 0-4.612-.756-6.432-2.039l-.448-.334-2.648.888.888-2.648-.334-.448A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              Hablar por WhatsApp
            </Button>
          </a>
        </div>

        <p className="text-xs text-muted-foreground/50 mt-8">
          © {new Date().getFullYear()} {BRAND}. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default Contact;
