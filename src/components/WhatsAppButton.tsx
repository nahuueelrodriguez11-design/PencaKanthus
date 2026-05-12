// ============================================
// WHATSAPP FLOATING BUTTON
// Botón fijo para pedir en Kanthus
// ============================================
export function WhatsAppButton() {
  // Número de WhatsApp de Kanthus (cambiar por el real)
  const whatsappNumber = "59899000000";
  const message = encodeURIComponent("¡Hola! Quiero hacer un pedido en Kanthus Smash Club 🍔");

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      title="Pedir en Kanthus"
      aria-label="Pedir en Kanthus por WhatsApp"
    >
      💬
    </a>
  );
}
