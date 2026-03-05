import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/logo-full.png";

const BRAND = "Smart Play";

const Privacy = () => (
  <div className="min-h-screen casino-gradient text-foreground">
    <div className="max-w-2xl mx-auto px-5 py-10">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Volver al inicio
      </Link>

      <div className="flex justify-center mb-6">
        <Link to="/"><img src={logo} alt={BRAND} className="w-36 h-36 object-contain" /></Link>
      </div>

      <h1 className="text-2xl font-black text-center gold-text mb-8">Política de Privacidad</h1>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p className="text-xs text-muted-foreground/50">Última actualización: Marzo 2026</p>

        <section>
          <h2 className="text-base font-bold text-foreground mb-2">1. Información que Recopilamos</h2>
          <p>En {BRAND} recopilamos información necesaria para brindarle una experiencia de entretenimiento segura y personalizada:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong>Datos de registro:</strong> nombre, número de teléfono y datos de contacto.</li>
            <li><strong>Datos de uso:</strong> información sobre cómo interactúa con nuestra plataforma, preferencias y actividades.</li>
            <li><strong>Datos técnicos:</strong> dirección IP, tipo de dispositivo, navegador y sistema operativo.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground mb-2">2. Uso de la Información</h2>
          <p>Utilizamos su información personal para:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Gestionar su cuenta y proporcionarle acceso a nuestros servicios de entretenimiento.</li>
            <li>Procesar bonificaciones y promociones.</li>
            <li>Mejorar y personalizar su experiencia en la plataforma.</li>
            <li>Comunicarnos con usted sobre actualizaciones, ofertas y novedades.</li>
            <li>Cumplir con obligaciones legales y regulatorias.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground mb-2">3. Compartición de Datos</h2>
          <p>No vendemos ni compartimos su información personal con terceros para fines comerciales. Podemos compartir datos únicamente con:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Proveedores de servicios que nos asisten en la operación de la plataforma.</li>
            <li>Autoridades competentes cuando la ley lo requiera.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground mb-2">4. Cookies y Tecnologías de Seguimiento</h2>
          <p>Utilizamos cookies y tecnologías similares para mejorar la funcionalidad de la plataforma, analizar el uso del sitio y personalizar contenido. Puede gestionar sus preferencias de cookies desde la configuración de su navegador.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground mb-2">5. Sus Derechos</h2>
          <p>Usted tiene derecho a:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Acceder a sus datos personales almacenados en nuestra plataforma.</li>
            <li>Solicitar la corrección de información inexacta.</li>
            <li>Solicitar la eliminación de su cuenta y datos personales.</li>
            <li>Oponerse al procesamiento de sus datos para fines de marketing.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground mb-2">6. Seguridad</h2>
          <p>Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal contra acceso no autorizado, pérdida o alteración. Utilizamos cifrado SSL y protocolos de seguridad estándar de la industria.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground mb-2">7. Retención de Datos</h2>
          <p>Conservamos su información personal mientras su cuenta esté activa o según sea necesario para cumplir con nuestras obligaciones legales. Puede solicitar la eliminación de sus datos en cualquier momento contactándonos.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground mb-2">8. Contacto</h2>
          <p>Para ejercer sus derechos o realizar consultas sobre nuestra política de privacidad, contáctenos a través de WhatsApp.</p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-border/30 text-center">
        <Link to="/" className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors">
          © {new Date().getFullYear()} {BRAND}. Todos los derechos reservados.
        </Link>
      </div>
    </div>
  </div>
);

export default Privacy;
