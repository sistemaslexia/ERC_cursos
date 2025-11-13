// Configuración de Meta Pixel para el cliente
import { getPixelConfig } from "./pixelConfig";

/**
 * Obtener configuración del Meta Pixel
 */
export function getMetaPixel() {
  const config = getPixelConfig();

  return {
    pixelId: config.pixelId,
    enabled: !!config.pixelId,
  };
}

/**
 * Inicializar Meta Pixel en el navegador
 */
export function initMetaPixel(pixelId) {
  if (typeof window === "undefined" || !pixelId) return;

  // Evitar inicializar dos veces
  if (window.fbq) return;

  // Código de inicialización de Meta Pixel
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js"
  );

  window.fbq("init", pixelId);
  window.fbq("track", "PageView");
}

/**
 * Trackear evento en Meta Pixel
 */
export function trackMetaEvent(eventName, eventData = {}) {
  if (typeof window === "undefined" || !window.fbq) return;

  window.fbq("track", eventName, eventData);
}

/**
 * Trackear evento personalizado
 */
export function trackCustomEvent(eventName, eventData = {}) {
  if (typeof window === "undefined" || !window.fbq) return;

  window.fbq("trackCustom", eventName, eventData);
}
