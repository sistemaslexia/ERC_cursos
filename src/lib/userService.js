// Servicio para gestionar usuarios con Strapi
import { strapiClient } from "./strapi.js";
import {
  // generateSlug,
  // createUniqueSlug,
  validateUserData,
  formatUserForStrapi,
} from "./types.js";

class UserService {
  /**
   * Registra un nuevo usuario en Strapi cuando se registra en Clerk
   * @param {Object} clerkUser - Datos del usuario de Clerk
   * @returns {Promise<Object>} Usuario creado en Strapi
   */
  async createUserFromClerk(clerkUser) {
    try {
      let nombre, email;

      // Determinar si viene del webhook o del hook de Clerk
      if (clerkUser.nombre && clerkUser.email) {
        // Datos ya transformados del webhook
        nombre = clerkUser.nombre;
        email = clerkUser.email;
      } else {
        // Datos directos de Clerk (desde hook)
        nombre =
          `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
          clerkUser.username ||
          clerkUser.emailAddresses?.[0]?.emailAddress?.split("@")[0] ||
          "Usuario";

        email = clerkUser.emailAddresses?.[0]?.emailAddress;
      }

      // Validar que tenemos email (permitir emails de test)
      if (!email) {
        throw new Error("No se pudo obtener el email del usuario");
      }

      // Verificar si el usuario ya existe por email
      const existingUser = await this.getUserByEmail(email);
      if (existingUser) {
        return existingUser;
      }

      // Crear datos del usuario - incluyendo clerkId que ahora existe en Strapi
      const clerkId = clerkUser.clerkId || clerkUser.id;

      const userData = {
        nombre,
        email,
        clerkId: clerkId,
      };

      // Validar datos
      const validation = validateUserData(userData);
      if (!validation.isValid) {
        throw new Error(`Datos inválidos: ${validation.errors.join(", ")}`);
      }

      // Crear usuario en Strapi
      const response = await strapiClient.createCliente(
        formatUserForStrapi(userData)
      );

      return response.data;
    } catch (error) {
      console.error("Error creando usuario en Strapi:", error);
      throw error;
    }
  }

  /**
   * Obtiene un usuario por su email
   * @param {string} email - Email del usuario
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  async getUserByEmail(email) {
    try {
      const response = await strapiClient.getClienteByEmail(email);
      return response.data && response.data.length > 0
        ? response.data[0]
        : null;
    } catch (error) {
      console.error("Error obteniendo usuario por email:", error);
      return null;
    }
  }

  /**
   * Obtiene un usuario por su ID de Clerk
   * @param {string} clerkId - ID de Clerk del usuario
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  async getUserByClerkId(clerkId) {
    try {
      const response = await strapiClient.request(
        `/api/clientes?filters[clerkId][$eq]=${clerkId}&populate=*`
      );
      return response.data && response.data.length > 0
        ? response.data[0]
        : null;
    } catch (error) {
      console.error("Error obteniendo usuario por Clerk ID:", error);
      return null;
    }
  }

  /**
   * Obtiene un usuario por su slug
   * @param {string} slug - Slug del usuario
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  async getUserBySlug(slug) {
    try {
      const response = await strapiClient.getClienteBySlug(slug);
      return response.data && response.data.length > 0
        ? response.data[0]
        : null;
    } catch (error) {
      console.error("Error obteniendo usuario por slug:", error);
      return null;
    }
  }

  /**
   * Actualiza un usuario existente
   * @param {number} userId - ID del usuario en Strapi
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  async updateUser(userId, updateData) {
    try {
      console.log("🔄 Actualizando usuario:", {
        userId,
        updateData,
        formattedData: formatUserForStrapi(updateData),
      });

      const response = await strapiClient.updateCliente(
        userId,
        formatUserForStrapi(updateData)
      );

      return response.data;
    } catch (error) {
      console.error("❌ Error actualizando usuario:", error);
      console.error("📋 Detalles del error:", {
        userId,
        updateData,
        errorMessage: error.message,
      });
      throw error;
    }
  }

  /**
   * Agrega un curso comprado al usuario
   * @param {string} clerkId - ID de Clerk del usuario
   * @param {Object} cursoData - Datos del curso comprado
   * @returns {Promise<Object>} Usuario actualizado
   */
  async addCursoComprado(clerkId, cursoData) {
    try {
      const user = await this.getUserByClerkId(clerkId);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      // Verificar si el curso ya está comprado
      const cursosExistentes = user.courses || [];
      const cursoExiste = cursosExistentes.some(
        (curso) => curso.id === cursoData.cursoId
      );

      if (cursoExiste) {
        throw new Error("El usuario ya tiene este curso");
      }

      // Obtener los IDs de cursos existentes
      const cursosIds = cursosExistentes.map((curso) => curso.id);

      // Agregar el nuevo curso ID
      const cursosActualizados = [...cursosIds, cursoData.cursoId];

      // Actualizar con la relación de cursos
      return await this.updateUser(user.id, {
        courses: cursosActualizados,
      });
    } catch (error) {
      console.error("Error agregando curso comprado:", error);
      throw error;
    }
  }

  /**
   * Agrega un curso comprado al usuario usando el slug del curso
   * @param {string} clerkId - ID de Clerk del usuario
   * @param {string} courseSlug - Slug del curso comprado
   * @returns {Promise<Object>} Usuario actualizado
   */
  async addCursoBySlug(clerkId, courseSlug) {
    try {
      console.log("🔍 Buscando curso con slug:", courseSlug);

      // Primero obtener el curso por su slug
      const courseResponse = await strapiClient.getCursoBySlug(courseSlug);
      console.log("📚 Respuesta del curso:", courseResponse);

      if (!courseResponse.data || courseResponse.data.length === 0) {
        console.log("❌ Curso no encontrado con slug:", courseSlug);
        throw new Error(`Curso con slug '${courseSlug}' no encontrado`);
      }

      const course = courseResponse.data[0];
      console.log("✅ Curso encontrado:", {
        id: course.id,
        nombre: course.nombre || course.name,
        slug: course.slug,
      });

      const user = await this.getUserByClerkId(clerkId);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      console.log("👤 Usuario actual:", {
        id: user.id,
        documentId: user.documentId,
        nombre: user.nombre,
        cursosExistentes: user.courses?.length || 0,
      });

      // Verificar si el curso ya está comprado
      const cursosExistentes = user.courses || [];
      const cursoExiste = cursosExistentes.some(
        (curso) => curso.id === course.id
      );

      if (cursoExiste) {
        console.log("ℹ️ Usuario ya tiene este curso");
        return user; // Retornar usuario sin error si ya tiene el curso
      }

      // Obtener los IDs de cursos existentes
      const cursosIds = cursosExistentes.map((curso) => curso.id);

      // Agregar el nuevo curso ID
      const cursosActualizados = [...cursosIds, course.id];

      console.log("🔄 Intentando actualizar con ID:", user.id);

      // Intentar primero con el ID numérico
      try {
        const updatedUser = await this.updateUser(user.id, {
          courses: cursosActualizados,
        });
        return updatedUser;
      } catch (error) {
        console.log("❌ Error con ID numérico, probando con documentId...");

        // Si falla, intentar con documentId (Strapi v5)
        if (user.documentId) {
          console.log(
            "🔄 Intentando actualizar con documentId:",
            user.documentId
          );
          const updatedUser = await this.updateUser(user.documentId, {
            courses: cursosActualizados,
          });
          return updatedUser;
        } else {
          throw error; // Re-lanzar error original si no hay documentId
        }
      }
    } catch (error) {
      console.error("Error agregando curso por slug:", error);
      throw error;
    }
  }

  /**
   * Actualiza el progreso de un curso
   * @param {string} clerkId - ID de Clerk del usuario
   * @param {number} cursoId - ID del curso
   * @param {number} progreso - Nuevo progreso (0-100)
   * @returns {Promise<Object>} Usuario actualizado
   */
  async updateCursoProgress(clerkId, cursoId, progreso) {
    try {
      const user = await this.getUserByClerkId(clerkId);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      const cursosComprados = user.courses || [];
      const cursoIndex = cursosComprados.findIndex(
        (curso) => curso.cursoId === cursoId
      );

      if (cursoIndex === -1) {
        throw new Error("Curso no encontrado en los cursos comprados");
      }

      // Actualizar el progreso y último acceso
      cursosComprados[cursoIndex] = {
        ...cursosComprados[cursoIndex],
        progreso: Math.min(Math.max(progreso, 0), 100), // Asegurar que esté entre 0-100
        completado: progreso >= 100,
        ultimoAcceso: new Date().toISOString(),
      };

      return await this.updateUser(user.id, {
        cursosComprados,
      });
    } catch (error) {
      console.error("Error actualizando progreso del curso:", error);
      throw error;
    }
  }

  /**
   * Obtiene todos los slugs existentes para generar únicos
   * @returns {Promise<string[]>} Array de slugs existentes
   */
  async getAllSlugs() {
    try {
      const response = await strapiClient.request("/api/clientes?fields=slug");
      return response.data.map((user) => user.slug);
    } catch (error) {
      console.error("Error obteniendo slugs:", error);
      return [];
    }
  }

  /**
   * Actualiza un usuario por su Clerk ID
   * @param {string} clerkId - ID de Clerk del usuario
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  async updateUserByClerkId(clerkId, updateData) {
    try {
      const user = await this.getUserByClerkId(clerkId);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      return await this.updateUser(user.id, updateData);
    } catch (error) {
      console.error("Error actualizando usuario por Clerk ID:", error);
      throw error;
    }
  }

  /**
   * Obtiene los cursos comprados de un usuario
   * @param {string} clerkId - ID de Clerk del usuario
   * @returns {Promise<Array>} Array de cursos comprados
   */
  async getUserCourses(clerkId) {
    try {
      const user = await this.getUserByClerkId(clerkId);
      if (!user) {
        return [];
      }

      const courses = user.courses || [];
      return courses;
    } catch (error) {
      console.error("Error obteniendo cursos del usuario:", error);
      return [];
    }
  }
}

// Exportar una instancia única del servicio
export const userService = new UserService();
export default userService;
