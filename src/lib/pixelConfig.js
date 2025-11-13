// Configuración de Meta Pixel - Solo para curso de diabetes
// Ya que solo manejas un curso, la configuración es simple

const PIXEL_CONFIG = {
  pixelId: process.env.NEXT_PUBLIC_META_PIXEL_DIABETES_BASICO,
  accessToken: process.env.META_CONVERSION_API_TOKEN_DIABETES_BASICO,
  testCode: process.env.META_CONVERSION_API_TEST_CODE_DIABETES_BASICO,
};

/**
 * Obtener configuración del pixel
 */
export function getPixelConfig() {
  return PIXEL_CONFIG;
}

/**
 * Verificar si el pixel está configurado correctamente
 */
export function isPixelConfigured() {
  return !!(PIXEL_CONFIG.pixelId && PIXEL_CONFIG.accessToken);
}
