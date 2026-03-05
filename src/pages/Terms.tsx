import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/logo-full.png";

const BRAND = "Smart Play";

const Terms = () => (
  <div className="min-h-screen casino-gradient text-foreground">
    <div className="max-w-2xl mx-auto px-5 py-10">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Volver al inicio
      </Link>

      <div className="flex justify-center mb-6">
        <Link to="/"><img src={logo} alt={BRAND} className="w-36 h-36 object-contain" /></Link>
      </div>

      <h1 className="text-2xl font-black text-center gold-text mb-8">Términos y Condiciones</h1>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p className="text-xs text-muted-foreground/50">Última actualización: Marzo 2026</p>

        <section>
          <h2 className="text-base font-bold text-foreground mb-2">1. Aceptación de los Términos</h2>
          <p>Al acceder y utilizar la plataforma de entretenimiento digital {BRAND}, usted acepta quedar vinculado por estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, le solicitamos que no utilice nuestros servicios.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground mb-2">2. Elegibilidad</h2>
          <p>Para utilizar {BRAND} debe ser mayor de 18 años. Nos reservamos el derecho de solicitar documentación que verifique su edad en cualquier momento. El uso de la plataforma por menores de edad está estrictamente prohibido.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground mb-2">3. Registro y Cuenta de Usuario</h2>
          <p>Al crear una cuenta en {BRAND}, usted se compromete a proporcionar información veraz, completa y actualizada. Es responsable de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades que se realicen bajo su cuenta.</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Cada usuario puede mantener una única cuenta activa.</li>
            <li>Las cuentas son personales e intransferibles.</li>
            <li>Cualquier uso fraudulento resultará en la suspensión inmediata de la cuenta.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground mb-2">4. Bonificaciones y Promociones</h2>
          <p>Las bonificaciones ofrecidas por {BRAND} están sujetas a condiciones específicas de uso. Cada promoción puede tener requisitos de participación que serán comunicados de forma clara al momento de su activación.</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Las bonificaciones tienen un período de validez limitado.</li>
            <li>El incumplimiento de las condiciones puede resultar en la anulación de la bonificación.</li>
            <li>{BRAND} se reserva el derecho de modificar o cancelar promociones en cualquier momento.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground mb-2">5. Uso de la Plataforma</h2>
          <p>Los usuarios se comprometen a utilizar la plataforma de entretenimiento de manera responsable y conforme a la legislación aplicable. Queda prohibido:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Utilizar software automatizado o bots.</li>
            <li>Intentar manipular los resultados de las experiencias de juego.</li>
            <li>Realizar actividades que comprometan la integridad de la plataforma.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground mb-2">6. Propiedad Intelectual</h2>
          <p>Todo el contenido de {BRAND}, incluyendo pero no limitado a logotipos, diseños, textos, gráficos y software, es propiedad exclusiva de {BRAND} y está protegido por las leyes de propiedad intelectual aplicables.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground mb-2">7. Limitación de Responsabilidad</h2>
          <p>{BRAND} proporciona sus servicios de entretenimiento digital "tal cual". No garantizamos la disponibilidad ininterrumpida del servicio. En ningún caso seremos responsables por daños indirectos, incidentales o consecuentes derivados del uso de la plataforma.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground mb-2">8. Modificaciones</h2>
          <p>Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios entrarán en vigor desde su publicación en la plataforma. El uso continuado de {BRAND} después de cualquier modificación constituye la aceptación de los nuevos términos.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground mb-2">9. Contacto</h2>
          <p>Para consultas sobre estos términos, puede contactarnos a través de nuestro canal de atención al cliente en WhatsApp.</p>
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

export default Terms;
