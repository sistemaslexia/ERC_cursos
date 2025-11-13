"use client";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { userService } from "@/lib/userService";
import { strapiClient } from "@/lib/strapi";

export default function CourseDetailPage() {
  const router = useRouter();
  const courseSlug = "curso-basico-de-enfermedad-renal-cronica"; // Slug fijo para este curso
  const { user: clerkUser, isLoaded } = useUser();

  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [userCourses, setUserCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  // Cargar datos del curso y videos
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);

        // Obtener curso por slug
        const courseResponse = await strapiClient.getCursoBySlug(courseSlug);

        if (courseResponse.data && courseResponse.data.length > 0) {
          const courseData = courseResponse.data[0];
          setCourse(courseData);

          // Obtener videos del curso
          const videosResponse = await strapiClient.getVideosByCurso(
            courseSlug
          );
          setVideos(videosResponse.data || []);
        } else {
          setError("Curso no encontrado");
        }
      } catch (error) {
        console.error("❌ Error obteniendo datos del curso:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseSlug]);

  // Cargar cursos del usuario para verificar si ya tiene este curso
  useEffect(() => {
    async function loadUserCourses() {
      if (!isLoaded || !clerkUser?.id) return;

      try {
        setCoursesLoading(true);
        const courses = await userService.getUserCourses(clerkUser.id);
        setUserCourses(courses);
      } catch (error) {
        console.error("Error cargando cursos del usuario:", error);
      } finally {
        setCoursesLoading(false);
      }
    }

    loadUserCourses();
  }, [isLoaded, clerkUser?.id]);

  // Verificar si el usuario ya tiene el curso
  const hasCourse =
    course &&
    !coursesLoading &&
    userCourses.some((c) => c.slug === course.slug);

  // Manejar compra con Stripe Checkout
  const handlePurchase = async () => {
    if (!course) return;

    try {
      setShowCheckout(true); // Mostrar loading

      const items = [
        {
          name: course.nombre,
          description: `Acceso completo al curso: ${course.nombre}`,
          price: course.precio,
          quantity: 1,
          slug: course.slug,
          courseId: course.id,
          courseSlug: course.slug,
        },
      ];

      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items,
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirigir a Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error("Error obteniendo URL de pago");
      }
    } catch (error) {
      console.error("Error iniciando compra:", error);
      alert("Error iniciando el proceso de pago. Intenta nuevamente.");
      setShowCheckout(false);
    }
  };

  // Estados de carga y error
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Curso no encontrado"}
          </h1>
          <Link href="/courses" className="text-blue-600 hover:text-blue-800">
            Volver a cursos
          </Link>
        </div>
      </div>
    );
  }

  const attrs = course.attributes || course;

  return (
    <div className="min-h-screen bg-white">
      {/* Header simple */}
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-900">
            CursoLexia
          </Link>

          <nav className="flex items-center space-x-6">
            <Link
              href="https://cursos.lexiahealthacademy.com/courses"
              className="text-gray-600 hover:text-gray-900"
            >
              Cursos
            </Link>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Iniciar Sesión
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link
                href="https://cursos.lexiahealthacademy.com/my-courses"
                className="text-gray-600 hover:text-gray-900"
              >
                Mis Cursos
              </Link>
              <UserButton />
            </SignedIn>
          </nav>
        </div>
      </header>

      {/* Logos Section */}
      <div className="bg-linear-to-r from-slate-50 via-white to-blue-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex justify-center items-center space-x-6 lg:space-x-8">
            {/* Logo 1 */}
            <div className="shrink-0">
              <div className="bg-linear-to-br from-blue-50 via-white to-indigo-50 rounded-xl p-4 shadow-lg shadow-blue-200/20 border border-blue-100/50 hover:shadow-xl transition-all duration-300">
                <img
                  src="https://lexiahealthacademy.nyc3.cdn.digitaloceanspaces.com/Imagenes-logos-iconos-Lexia/Logos/logo.png"
                  alt="Lexia Health Academy Logo"
                  className="h-8 lg:h-10 w-auto mx-auto filter drop-shadow-sm"
                />
              </div>
            </div>

            {/* Logo 2 */}
            <div className="shrink-0">
              <div className="bg-linear-to-br from-purple-50 via-white to-pink-50 rounded-xl p-4 shadow-lg shadow-purple-200/20 border border-purple-100/50 hover:shadow-xl transition-all duration-300">
                <img
                  src="https://lexiahealthacademy.nyc3.cdn.digitaloceanspaces.com/Imagenes-logos-iconos-Lexia/Logos/Logo-lexia.png"
                  alt="Lexia Logo"
                  className="h-8 lg:h-10 w-auto mx-auto filter drop-shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <nav className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Volver a cursos
          </Link>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {attrs.nombre || "Curso sin título"}
            </h1>

            <p className="text-lg text-gray-600 mb-6">
              {attrs.descripcion || "Sin descripción disponible"}
            </p>

            <div className="flex items-center gap-6 mb-8">
              {attrs.nivel && (
                <span className="text-gray-600">Nivel {attrs.nivel}</span>
              )}
              {attrs.duracion && (
                <span className="text-gray-600">{attrs.duracion}</span>
              )}
              {attrs.instructor && (
                <span className="text-gray-600">
                  Instructor: {attrs.instructor}
                </span>
              )}
            </div>

            {/* Lista de videos/módulos */}
            {videos.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Contenido del Curso
                </h2>
                <div className="space-y-2">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="font-medium text-gray-900 mb-1">
                        {video.attributes?.nombre || video.nombre}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {video.attributes?.modulo || video.modulo}
                      </div>
                      {!hasCourse && (
                        <div className="text-xs text-gray-500">
                          🔒 Debes comprar el curso para acceder a este
                          contenido
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  ${attrs.precio || "0.00"}
                </div>
                <p className="text-gray-600">Acceso de por vida</p>
                {videos.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    {videos.length} video{videos.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>

              {/* Mostrar mensaje de éxito */}
              {purchaseSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  ¡Curso comprado exitosamente! 🎉
                </div>
              )}

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 mb-4">
                    Iniciar sesión para comprar
                  </button>
                </SignInButton>
                <p className="text-sm text-gray-600 text-center">
                  Inicia sesión para comprar este curso
                </p>
              </SignedOut>

              <SignedIn>
                {coursesLoading ? (
                  <div className="w-full bg-gray-300 py-3 rounded-lg mb-4 text-center">
                    Cargando...
                  </div>
                ) : hasCourse ? (
                  <div className="text-center">
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                      ✅ Ya tienes este curso
                    </div>
                    <Link
                      href={`https://cursos.lexiahealthacademy.com/my-courses/${course.slug}`}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 block text-center"
                    >
                      Acceder al curso
                    </Link>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handlePurchase}
                      disabled={showCheckout}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 mb-4 disabled:opacity-50"
                    >
                      {showCheckout ? "Redirigiendo..." : "Comprar"}
                    </button>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Pago seguro</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Acceso inmediato • Garantía de 30 días
                      </p>
                    </div>
                  </>
                )}
              </SignedIn>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
