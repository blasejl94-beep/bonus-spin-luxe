import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
const logo = "/logo-full.png";

const BRAND = "Smart Play";

const ResponsibleGaming = () => (
  <div className="min-h-screen casino-gradient text-foreground">
    <div className="max-w-2xl mx-auto px-5 py-10">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Volver al inicio
      </Link>

      <div className="flex justify-center mb-6">
        <Link to="/"><img src={logo} alt={BRAND} width={144} height={144} decoding="async" className="w-36 h-36 object-contain" /></Link>
      </div>

      <h1 className="text-2xl font-black text-center gold-text mb-8">Entretenimiento Responsable</h1>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section>
          <p>En {BRAND} nos comprometemos a promover un entorno de entretenimiento seguro y responsable. Queremos que disfrutes de nuestras experiencias de juego de forma saludable y consciente.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground mb-2">🎯 Nuestro Compromiso</h2>
          <p>{BRAND} opera bajo principios de entretenimiento responsable. Creemos que nuestras experiencias de juego deben ser una actividad recreativa y nunca una fuente de problemas.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground mb-2">📋 Autoevaluación</h2>
          <p>Pregúntate si alguna de estas situaciones te resulta familiar:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>¿Dedicás más tiempo del planeado a actividades de entretenimiento digital?</li>
            <li>¿Gastás más de lo que tu presupuesto permite?</li>
            <li>¿Te resulta difícil dejar de participar aunque quieras parar?</li>
            <li>¿El entretenimiento digital afecta tus relaciones personales o laborales?</li>
            <li>¿Intentás recuperar créditos perdidos participando más?</li>
          </ul>
          <p className="mt-2">Si respondiste "sí" a alguna de estas preguntas, te recomendamos buscar apoyo.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground mb-2">🛡️ Herramientas de Control</h2>
          <p>Ponemos a tu disposición herramientas para gestionar tu experiencia:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong>Límites de tiempo:</strong> Establecé un tiempo máximo diario de uso.</li>
            <li><strong>Límites de presupuesto:</strong> Definí un monto máximo para tus actividades.</li>
            <li><strong>Pausas temporales:</strong> Solicitá una pausa de tu cuenta por el período que necesites.</li>
            <li><strong>Autoexclusión:</strong> Pedí que tu cuenta sea suspendida de forma indefinida.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground mb-2">💡 Consejos para un Uso Responsable</h2>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Establecé un presupuesto antes de comenzar y respetalo.</li>
            <li>No intentes recuperar lo perdido aumentando tu participación.</li>
            <li>Tomá descansos regulares.</li>
            <li>No uses el entretenimiento digital como forma de evadir problemas.</li>
            <li>Recordá que el entretenimiento digital es una actividad recreativa, no una fuente de ingresos.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground mb-2">📞 Recursos de Ayuda</h2>
          <p>Si necesitás ayuda o apoyo, podés contactar a las siguientes organizaciones:</p>
          <div className="mt-3 space-y-2">
            <div className="glass-card rounded-lg p-3">
              <p className="font-semibold text-foreground">Línea de atención {BRAND}</p>
              <p className="text-xs">Contactanos por WhatsApp para solicitar herramientas de control o hablar con un asesor.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-foreground mb-2">🔞 Protección de Menores</h2>
          <p>El uso de {BRAND} está estrictamente prohibido para menores de 18 años. Recomendamos a los adultos responsables implementar controles parentales en los dispositivos que usan los menores.</p>
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

export default ResponsibleGaming;
