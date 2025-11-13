// Meta Conversions API - Server-Side Tracking
import crypto from "crypto";
import { getPixelConfig, isPixelConfigured } from "./pixelConfig";

const META_API_VERSION = "v18.0";
const META_API_URL = `https://graph.facebook.com/${META_API_VERSION}`;

/**
 * Hashear datos de usuario para privacidad
 */
function hashData(data) {
  if (!data) return null;
  return crypto.createHash("sha256").update(data.toLowerCase()).digest("hex");
}

/**
 * Preparar datos de usuario para Meta
 */
function prepareUserData(userData = {}) {
  return {
    em: userData.email ? hashData(userData.email) : null,
    fn: userData.firstName ? hashData(userData.firstName) : null,
    ln: userData.lastName ? hashData(userData.lastName) : null,
    external_id: userData.userId || null,
  };
}

/**
 * Enviar evento a Meta Conversions API
 */
export async function sendMetaEvent(eventName, eventData = {}, userData = {}) {
  console.log(
    `📊 [Meta Conversions API] Iniciando envío de evento: ${eventName}`
  );

  if (!isPixelConfigured()) {
    console.error("❌ [Meta Conversions API] Pixel no está configurado");
    return { success: false, error: "Pixel not configured" };
  }

  const config = getPixelConfig();
  console.log(`🎯 [Meta Conversions API] Pixel ID: ${config.pixelId}`);
  console.log(
    `🔑 [Meta Conversions API] Access Token: ${
      config.accessToken
        ? "Configurado (" + config.accessToken.length + " chars)"
        : "NO CONFIGURADO"
    }`
  );
  console.log(
    `🧪 [Meta Conversions API] Test Code: ${
      config.testCode || "No configurado"
    }`
  );

  const url = `${META_API_URL}/${config.pixelId}/events?access_token=${config.accessToken}`;

  const eventTime = Math.floor(Date.now() / 1000);
  const eventId = `${eventName}_${eventTime}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: eventTime,
        event_id: eventId,
        event_source_url:
          eventData.source_url || process.env.NEXT_PUBLIC_APP_URL,
        action_source: "website",
        user_data: prepareUserData(userData),
        custom_data: eventData.custom_data || {},
      },
    ],
  };

  // Agregar test_event_code si está disponible
  if (config.testCode) {
    payload.test_event_code = config.testCode;
    console.log(
      `🧪 [Meta Conversions API] Usando test code: ${config.testCode}`
    );
  }

  console.log(
    `📤 [Meta Conversions API] Payload:`,
    JSON.stringify(payload, null, 2)
  );

  try {
    console.log(
      `🌐 [Meta Conversions API] Enviando a: ${META_API_URL}/${config.pixelId}/events`
    );

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ [Meta Conversions API] Error en respuesta:", {
        status: response.status,
        statusText: response.statusText,
        result,
      });
      return { success: false, error: result, status: response.status };
    }

    console.log(
      `✅ [Meta Conversions API] Evento ${eventName} enviado exitosamente a Pixel ${config.pixelId}`
    );
    console.log(`📥 [Meta Conversions API] Respuesta:`, result);

    return { success: true, data: result, eventId };
  } catch (error) {
    console.error("❌ [Meta Conversions API] Error de red:", error);
    return { success: false, error: error.message };
  }
}
