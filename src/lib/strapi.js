// Cliente HTTP para comunicarse con Strapi
const STRAPI_URL = "https://cursolexia-back-production.up.railway.app";

class StrapiClient {
  constructor() {
    this.baseURL = STRAPI_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Agregar token de API si está disponible (para mayor seguridad)
    if (process.env.STRAPI_API_TOKEN) {
      headers.Authorization = `Bearer ${process.env.STRAPI_API_TOKEN}`;
    }

    const config = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${errorBody}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Strapi request error:", error);
      throw error;
    }
  }

  // Métodos para usuarios/clientes
  async createCliente(userData) {
    return this.request("/api/clientes", {
      method: "POST",
      body: JSON.stringify({ data: userData }),
    });
  }

  async getCliente(id) {
    return this.request(`/api/clientes/${id}?populate=*`);
  }

  async updateCliente(id, userData) {
    const url = `/api/clientes/${id}`;
    console.log("🔗 Actualizando cliente en URL:", `${this.baseURL}${url}`);
    console.log("📤 Datos a enviar:", userData);

    return this.request(url, {
      method: "PUT",
      body: JSON.stringify({ data: userData }),
    });
  }

  async getClienteByEmail(email) {
    return this.request(
      `/api/clientes?filters[email][$eq]=${email}&populate=*`
    );
  }

  async getClienteBySlug(slug) {
    return this.request(`/api/clientes?filters[slug][$eq]=${slug}&populate=*`);
  }

  // Métodos para cursos
  async getCursos() {
    return this.request("/api/courses?populate=*");
  }

  async getCurso(id) {
    return this.request(`/api/courses/${id}?populate=*`);
  }

  async getCursoById(id) {
    return this.request(`/api/courses/${id}?populate=*`);
  }

  async getCursoBySlug(slug) {
    return this.request(`/api/courses?filters[slug][$eq]=${slug}&populate=*`);
  }

  // Métodos para videos
  async getVideosByCurso(cursoSlug) {
    return this.request(
      `/api/videos?filters[courses][slug][$eq]=${cursoSlug}&sort=modulo:asc`
    );
  }
}

// Exportar una instancia única
export const strapiClient = new StrapiClient();
export default strapiClient;
