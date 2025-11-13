// Tipos y estructuras para el usuario y cursos

/**
 * Estructura de datos del usuario
 * @typedef {Object} UserData
 * @property {number} [id] - ID del usuario en Strapi
 * @property {string} nombre - Nombre completo del usuario
 * @property {string} email - Email del usuario
 * @property {string} [password] - Password (solo para registro)
 * @property {string} slug - Slug único del usuario
 * @property {string} [clerkId] - ID de Clerk para sincronización
 * @property {CursoComprado[]} [cursosComprados] - Array de cursos comprados
 * @property {string} [createdAt] - Fecha de creación
 * @property {string} [updatedAt] - Fecha de actualización
 */

/**
 * Estructura de curso comprado
 * @typedef {Object} CursoComprado
 * @property {number} [id] - ID del curso comprado
 * @property {number} cursoId - ID del curso
 * @property {string} titulo - Título del curso
 * @property {number} precio - Precio pagado
 * @property {string} fechaCompra - Fecha de compra
 * @property {number} progreso - Progreso del curso (0-100)
 * @property {boolean} completado - Si el curso está completado
 * @property {string} [ultimoAcceso] - Última vez que accedió al curso
 */

/**
 * Respuesta de Strapi
 * @typedef {Object} StrapiResponse
 * @property {*} data - Datos de la respuesta
 * @property {Object} [meta] - Metadatos de paginación
 */

// Utilidades para generar slug único
export function generateSlug(nombre) {
  return nombre
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remover caracteres especiales
    .replace(/\s+/g, "-") // Reemplazar espacios con guiones
    .replace(/-+/g, "-") // Remover guiones duplicados
    .trim();
}

// Función para crear slug único con número si ya existe
export function createUniqueSlug(baseSlug, existingSlugs) {
  let slug = baseSlug;
  let counter = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

// Validaciones
export function validateUserData(userData) {
  const errors = [];

  if (!userData.nombre || userData.nombre.trim().length < 2) {
    errors.push("El nombre debe tener al menos 2 caracteres");
  }

  if (!userData.email || !userData.email.includes("@")) {
    errors.push("Email inválido");
  }

  // Validar slug solo si existe (campo opcional temporalmente)
  if (userData.slug && userData.slug.length < 3) {
    errors.push("El slug debe tener al menos 3 caracteres");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Función helper para formatear datos de usuario para Strapi
export function formatUserForStrapi(userData) {
  const formattedData = {};

  // Agregar campos solo si existen (no undefined)
  if (userData.nombre !== undefined) {
    formattedData.nombre = userData.nombre;
  }

  if (userData.email !== undefined) {
    formattedData.email = userData.email;
  }

  if (userData.slug !== undefined) {
    formattedData.slug = userData.slug;
  }

  if (userData.clerkId !== undefined) {
    formattedData.clerkId = userData.clerkId;
  }

  if (userData.cursosComprados !== undefined) {
    formattedData.cursosComprados = userData.cursosComprados;
  }

  // Agregar soporte para la relación de cursos
  if (userData.courses !== undefined) {
    formattedData.courses = userData.courses;
  }

  return formattedData;
}
