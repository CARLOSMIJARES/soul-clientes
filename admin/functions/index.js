const { onDocumentCreated, onDocumentUpdated, onDocumentDeleted } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();

const slackWebhookUrl = "https://hooks.slack.com/services/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";

async function sendSlackMessage(text) {
  try {
    await fetch(slackWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    console.log("Notificación enviada a Slack");
  } catch (error) {
    console.error("Error enviando notificación a Slack:", error);
  }
}

// Nueva reserva
exports.sendSlackNotificationOnNewReservation = onDocumentCreated(
  "reservas/{reservaId}",
  async (event) => {
    const data = event.data.data();

    const message =
      `🆕 *Nueva reserva creada:*\n` +
      `Cliente: ${data.cliente || "N/A"}\n` +
      `Correo: ${data.correo || "N/A"}\n` +
      `Servicio: ${data.servicio || "N/A"}\n` +
      `Duración: ${data.duracion || "N/A"}\n` +
      `Precio: ${data.precio || "N/A"}\n` +
      `Fecha: ${data.fecha || "N/A"}\n` +
      `Hora: ${data.hora || "N/A"}\n` +
      `Manicurista: ${data.manicurista || "N/A"}`;

    await sendSlackMessage(message);
  }
);

// Modificación de reserva
exports.sendSlackNotificationOnUpdatedReservation = onDocumentUpdated(
  "reservas/{reservaId}",
  async (event) => {
    const before = event.data.before.data();
    const after = event.data.after.data();

    const message =
      `✏️ *Reserva modificada:*\n` +
      `Cliente: ${after.cliente || "N/A"}\n` +
      `Correo: ${after.correo || "N/A"}\n` +
      `Servicio: ${after.servicio || "N/A"}\n` +
      `Duración: ${after.duracion || "N/A"}\n` +
      `Precio: ${after.precio || "N/A"}\n` +
      `Fecha: ${after.fecha || "N/A"}\n` +
      `Hora: ${after.hora || "N/A"}\n` +
      `Manicurista: ${after.manicurista || "N/A"}\n\n` +
      `Antes:\n` +
      JSON.stringify(before, null, 2) +
      `\nDespués:\n` +
      JSON.stringify(after, null, 2);

    await sendSlackMessage(message);
  }
);

// Eliminación de reserva
exports.sendSlackNotificationOnDeletedReservation = onDocumentDeleted(
  "reservas/{reservaId}",
  async (event) => {
    const data = event.data.data();

    const message =
      `🗑️ *Reserva eliminada:*\n` +
      `Cliente: ${data.cliente || "N/A"}\n` +
      `Correo: ${data.correo || "N/A"}\n` +
      `Servicio: ${data.servicio || "N/A"}\n` +
      `Duración: ${data.duracion || "N/A"}\n` +
      `Precio: ${data.precio || "N/A"}\n` +
      `Fecha: ${data.fecha || "N/A"}\n` +
      `Hora: ${data.hora || "N/A"}\n` +
      `Manicurista: ${data.manicurista || "N/A"}`;

    await sendSlackMessage(message);
  }
);


// 🔔 Webhook exclusivo para notificaciones de CLIENTES
const clientesSlackWebhookUrl = "https://hooks.slack.com/services/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"; // Reemplázalo por el tuyo

async function sendClientSlackMessage(text) {
  try {
    await fetch(clientesSlackWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    console.log("Notificación de cliente enviada a Slack");
  } catch (error) {
    console.error("Error enviando notificación de cliente a Slack:", error);
  }
}

// Nueva creación de cliente
exports.notifyNewClient = onDocumentCreated(
  "CLIENTES/{clienteId}",
  async (event) => {
    const data = event.data.data();

    const message =
      `🆕 *Nuevo cliente registrado:*\n` +
      `👤 Nombre: ${data.nombre || "N/A"} ${data.apellido || ""}\n` +
      `📧 Email: ${data.email || "N/A"}\n` +
      `📞 Teléfono: ${data.telefono || "N/A"}\n`

    await sendClientSlackMessage(message);
  }
);

// Actualización de cliente
exports.notifyClientUpdated = onDocumentUpdated(
  "CLIENTES/{clienteId}",
  async (event) => {
    const after = event.data.after.data();
    const before = event.data.before.data();

    const message =
      `✏️ *Cliente actualizado:*\n` +
      `👤 Nombre: ${after.nombre || "N/A"} ${after.apellido || ""}\n` +
      `📧 email: ${after.email || "N/A"}\n` +
      `📞 Teléfono: ${after.telefono || "N/A"}\n\n` +
      `🕘 *Cambios:* \nAntes: ${JSON.stringify(before, null, 2)}\nDespués: ${JSON.stringify(after, null, 2)}`;

    await sendClientSlackMessage(message);
  }
);

// Eliminación de cliente
exports.notifyClientDeleted = onDocumentDeleted(
  "CLIENTES/{clienteId}",
  async (event) => {
    const data = event.data.data();

    const message =
      `🗑️ *Cliente eliminado:*\n` +
      `👤 Nombre: ${data.nombre || "N/A"} ${data.apellido || ""}\n` +
      `📧 Correo: ${data.correo || "N/A"}\n` +
      `📞 Teléfono: ${data.telefono || "N/A"}`;

    await sendClientSlackMessage(message);
  }
);
