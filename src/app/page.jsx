"use client";

import Link from "next/link";
import Image from "next/image";

import { useState, useEffect } from "react";

export default function CursoBasicoDeEnfermedadRenalCronica() {
  const [isHovered, setIsHovered] = useState(false);
  const courseSlug = "curso-basico-de-enfermedad-renal-cronica";
  return (
    <div className="min-h-screen bg-white">
      <section
        className="relative h-20 overflow-hidden bg-cover bg-center bg-no-repeat shadow-lg w-full"
        style={{
          backgroundImage:
            'url("https://lexiahealthacademy.nyc3.cdn.digitaloceanspaces.com/Cursos/ERC/banner_inicial_erc.png")',
        }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/5 to-black/20"></div>
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none select-none">
          <img
            src="https://lexiahealthacademy.nyc3.cdn.digitaloceanspaces.com/Cursos/ERC/banner_inicial_erc.png"
            alt="Banner inicial ERC"
            className="h-20 w-auto object-contain"
            draggable={false}
          />
        </div>
      </section>

      <section className="py-8 md:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="text-center md:text-center">
              <h1 className="text-2xl md:text-5xl text-yellow-400 font-bold mb-4 px-2">
                ¡Toma el control de tu salud renal HOY!
              </h1>
              <p className="text-1xl md:text-4xl text-black mb-6 px-2">
                No dejes que la Enfermedad Renal Crónica decida por ti
              </p>
              <Link href={`/${courseSlug}`}>
                <button className="text-lg md:text-2xl inline-block bg-yellow-400 rounded-xl text-white font-semibold shadow-md text-center px-4 md:px-8 py-2 md:py-3 mt-2 hover:bg-yellow-500 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-300 whitespace-normal w-full max-w-xs md:max-w-md">
                  COMPRA AHORA
                </button>
              </Link>
            </div>

            <div>
              <div className="relative group">
                <div className="absolute -inset-4 group-hover:opacity-30 transition-opacity duration-300 "></div>
                <Image
                  src="/images/recurso_25.png"
                  alt="Curso de Enfermedad Renal Crónica"
                  width={450}
                  height={450}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección dibujo y pregunta */}

      <section className="py-12 md:py-20 px-4 md:px-6 bg-cyan-600">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-8 md:mb-10 text-center px-4">
            Con solo unos minutos al día, aprende a cuidarte y a mejorar tu
            calidad de vida.
          </h3>
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="relative group">
              <img
                src="https://lexiahealthacademy.nyc3.cdn.digitaloceanspaces.com/Cursos/ERC/recurso_30.png"
                alt="Persona preocupada"
                className="relative rounded-2xl shadow-2xl w-full h-180 object-cover transform hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="relative">
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start space-x-6 p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border-l-4 ">
                  <img
                    src="https://lexiahealthacademy.nyc3.cdn.digitaloceanspaces.com/Cursos/ERC/icon1.png"
                    alt="pregunta"
                    className="w-12 h-12 md:w-20 md:h-20 object-cover shrink-0"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 text-2xl">
                      ¿Te sientes abrumado por tu diagnóstico y no sabes por
                      dónde empezar?
                    </h4>
                  </div>
                </div>
                <div className="flex items-start space-x-6 p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border-l-4 ">
                  <img
                    src="https://lexiahealthacademy.nyc3.cdn.digitaloceanspaces.com/Cursos/ERC/icon2.png"
                    alt="Familia"
                    className="w-20 h-20 object-cover shrink-0 mt-1"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 text-2xl">
                      ¿Tienes miedo de que la enfermedad avance y afecte tu vida
                      o la de tu familia?
                    </h4>
                  </div>
                </div>
                <div className="flex items-start space-x-6 p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border-l-4 ">
                  <img
                    src="https://lexiahealthacademy.nyc3.cdn.digitaloceanspaces.com/Cursos/ERC/icon3.png"
                    alt="control"
                    className="w-20 h-20 object-cover shrink-0 mt-1"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 text-2xl">
                      ¿Te gustaría tener más control, energía y tranquilidad
                      sobre tu salud?
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Text y video de youtube */}
      <section className="py-8 md:py-10 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="flex justify-center">
              <div className="w-full max-w-full aspect-video">
                <iframe
                  className="w-full h-full rounded-lg"
                  src="https://www.youtube.com/embed/o4bgdVC3uO4"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div>
              <h1 className="text-2xl md:text-4xl text-indigo-600 font-bold mb-4">
                Este curso te da la claridad, las herramientas y la confianza
                que necesitas para enfrentar la Enfermedad Renal Crónica{" "}
                <span className="bg-yellow-300 px-1">sin miedo</span>
              </h1>
              <p className="text-lg md:text-2xl text-indigo-600">
                Con explicaciones sencillas, estrategias prácticas{" "}
                <span className="bg-yellow-300 px-1">
                  solo unos minutos al día
                </span>
                , aprenderás a tomar el control de tu salud, mejorar tu
                bienestar y cuidar tu vida con decisiones informadas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 2 mujer y texto */}

      <section className="py-8 md:py-10 px-4 md:px-6 bg-cyan-600">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="flex justify-center">
              <img
                src="https://lexiahealthacademy.nyc3.cdn.digitaloceanspaces.com/Cursos/ERC/recurso_33.png"
                alt="Persona preocupada"
                width={500}
                height={500}
                className="max-w-full h-auto"
              />
            </div>

            <div className="text-white">
              <h1 className="text-2xl md:text-4xl">
                Mientras muchos{" "}
                <span className="font-bold">pacientes y cuidadores</span>,
                enfrentan esta enfermedad con información incompleta y poco
                práctica,{" "}
                <span className="bg-cyan-700 font-bold px-2 py-1">
                  nuestro curso te brinda una guía clara y accesible para
                  comprender y manejar la ERC
                </span>
                , desde el diagnóstico hasta el autocuidado.
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* texto y dos iconos */}

      <section className="py-8 md:py-10 px-4 bg-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
            <div className="flex items-center justify-center text-center p-4">
              <h1 className="text-3xl md:text-5xl text-cyan-700 font-bold">
                ¡Otros cursos solo te confunden!
              </h1>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-cyan-700 rounded-xl px-4 py-6 text-white font-semibold shadow-md text-center w-full flex flex-col items-center justify-center min-h-[280px]">
                <div className="flex justify-center mb-4">
                  <img
                    src="https://lexiahealthacademy.nyc3.cdn.digitaloceanspaces.com/Cursos/ERC/recurso_35.png"
                    alt="Métodos confusos"
                    width={100}
                    height={100}
                  />
                </div>
                <span className="text-2xl">
                  Tienen métodos confusos que no explican claramente qué hacer.
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center h-full w-full">
              <div className="bg-cyan-700 rounded-xl px-4 py-10 text-white font-semibold shadow-md text-center w-full h-full flex flex-col items-center justify-center">
                <div className="flex justify-center mb-2">
                  <img
                    src="https://lexiahealthacademy.nyc3.cdn.digitaloceanspaces.com/Cursos/ERC/recurso_34.png"
                    alt="Persona preocupada"
                    width={100}
                    height={100}
                  />
                </div>
                <span className="text-2xl">
                  Escaso apoyo emocional para pacientes y cuidadores.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* texto y  iconos de experencia */}
      <section className=" py-6 bg-linear-to-b ">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-1 md:order-1 place-items-center text-center">
              <p className="text-3xl text-cyan-700 mb-6">
                Con {""}
                <span className="font-bold">
                  más de 15 años de experiencia en el manejo de enfermedades
                  crónicas
                </span>
                , hemos diseñado nuestra propia metodología para brindarte a ti
                y a los tuyos la confianza de que este curso es la mejor opción
                para su bienestar.
              </p>
            </div>

            <div className="order-2 md:order-2">
              <div className="relative group">
                <div className="absolute -inset-4 group-hover:opacity-30 transition-opacity duration-300 "></div>
                <Image
                  src="https://lexiahealthacademy.nyc3.cdn.digitaloceanspaces.com/Cursos/ERC/icon.png"
                  alt="Curso de Enfermedad Renal Crónica"
                  width={400}
                  height={400}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* doctor carlos parra y  texto */}

      <section className="py-5 px-6 bg-cyan-500">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-1 md:order-1 place-items-center text-center">
              <div className="relative group">
                <div className="absolute -inset-4 group-hover:opacity-30 transition-opacity duration-300 "></div>
                <Image
                  src="https://lexiahealthacademy.nyc3.cdn.digitaloceanspaces.com/Cursos/ERC/recurso_36.png"
                  alt="Curso de Enfermedad Renal Crónica"
                  width={400}
                  height={400}
                />
              </div>
            </div>
            <div className="order-2 md:order-2 ">
              <h1 className="text-5xl font-bold py-4">
                CONOCE MEJOR A QUIEN HA CREADO EL CONTENIDO
              </h1>
              <h2 className="text-3xl inline-block bg-cyan-700 rounded-xl text-white font-semibold shadow-md text-center px-4 py-2   ">
                Dr. Carlos González Parra
              </h2>
              <p className=" font-bold text-2xl py-4 ">
                Nefrólogo y Médico Internista con más de 15 años de
                experiencia...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* texto y  3 iconos */}
      <section className="py-10 bg-linear-to-b ">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl inline-block bg-yellow-300 rounded-xl text-white font-semibold shadow-md text-center px-4 py-2   ">
              ¿ENTONCES, LO QUIERES?
            </h2>
            <h1 className="text-2xl text-black py-3">
              Este curso cubre aspectos esenciales <br />
              del manejo de la Enfermedad Renal Crónica.
            </h1>
          </div>
          <div className="grid md:grid-cols-3 gap-16 items-stretch">
            <div className="flex items-center justify-center h-full w-full text-center">
              <div className="bg-gray-100 rounded-xl px-4 py-6 text-white font-semibold shadow-md  w-full h-full flex flex-col items-center justify-center">
                <div className="flex justify-center mb-2">
                  <img
                    src="https://lexiahealthacademy.nyc3.cdn.digitaloceanspaces.com/Cursos/ERC/icon7_1.png"
                    alt="Persona preocupada"
                    width={150}
                    height={150}
                  />
                </div>
                <h2 className="text-2xl inline-block bg-yellow-300 rounded-xl text-white font-semibold shadow-md text-center px-4 py-2   ">
                  Modulo I: <br /> Enfermedad Crónica
                </h2>
                <span className=" text-black py-3 ">
                  -¿Qué es una enfermedad crónica? <br />
                  <br />
                  -Diagnóstico temprano y en la vejez. <br />
                  <br />
                  -Implicaciones familiares y cómo manejarlas.
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center h-full w-full">
              <div className="bg-gray-100 rounded-xl px-4 py-6 text-white font-semibold shadow-md  w-full h-full flex flex-col items-center justify-center">
                <div className="flex justify-center mb-2">
                  <img
                    src="https://lexiahealthacademy.nyc3.cdn.digitaloceanspaces.com/Cursos/ERC/icon7.png"
                    alt="Persona preocupada"
                    width={150}
                    height={150}
                  />
                </div>
                <h2 className="text-2xl inline-block bg-yellow-300 rounded-xl text-white font-semibold shadow-md text-center px-4 py-2   ">
                  Modulo II:Entendiendo la Emfermedad Renal
                </h2>
                <span className=" text-black py-3 ">
                  -Anatomía y función del riñón. <br />
                  <br />
                  -Signos de alerta y cambios urgentes en alimentación. <br />
                  <br />
                  -Tratamientos como diálisis, trasplante y autocuidado físico.
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center h-full w-full">
              <div className="bg-gray-100 rounded-xl px-4 py-10 text-white font-semibold shadow-md  w-full h-full flex flex-col items-center justify-center">
                <div className="flex justify-center mb-2">
                  <img
                    src="https://lexiahealthacademy.nyc3.cdn.digitaloceanspaces.com/Cursos/ERC/icon8.png"
                    alt="Persona preocupada"
                    width={150}
                    height={150}
                  />
                </div>
                <h2 className="text-2xl inline-block bg-yellow-300 rounded-xl text-white font-semibold shadow-md text-center px-4 py-2   ">
                  Modulo II: Bienestar Psicoemocional
                </h2>
                <span className=" text-black py-3 ">
                  -Impacto emocional del diagnóstico. <br />
                  <br />
                  para el proceso de duelo. <br />
                  <br />
                  -Autocuidado del paciente y el cuidador.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Precio */}
      <section
        className="relative bg-cover bg-center bg-no-repeat min-h-128 flex flex-col items-center justify-center py-10 px-4 md:px-6"
        style={{
          backgroundImage:
            "url('https://lexiahealthacademy.nyc3.cdn.digitaloceanspaces.com/Cursos/ERC/banner_2_erc.png')",
        }}
      >
        <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto">
          <div className="bg-cyan-900 rounded-xl px-10 py-8 md:py-10 text-white font-semibold shadow-md w-full flex flex-col items-center justify-center">
            <h2 className="text-base line-through opacity-70 bg-center">
              DE $400.00
            </h2>
            <h1 className="text-4xl">A $300.00</h1>
            <Link href={`/${courseSlug}`}>
              <button className="text-lg md:text-2xl inline-block bg-yellow-400 rounded-xl text-white font-semibold shadow-md text-center px-4 md:px-8 py-2 md:py-3 mt-2 hover:bg-yellow-500 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-300 whitespace-normal w-full max-w-xs md:max-w-md">
                COMPRA AHORA
              </button>
            </Link>
            <h2 className="text-base py-4 text-center ">
              PAGO 100% SEGURO CON <br />
              ACCESO INMEDIATO
            </h2>
            <p className="text-base text-center">
              Accede al contenido desde <br />
              cualquier dispositivo.
            </p>
            <div className="flex justify-center mb-2">
              <img
                src="https://lexiahealthacademy.nyc3.cdn.digitaloceanspaces.com/Cursos/ERC/icon9_.png"
                alt="Persona preocupada"
                width={100}
                height={100}
              />
            </div>
          </div>
        </div>
      </section>

      {/* texto */}

      {/* Footer */}
      <footer className="bg-linear-to-r from-gray-900 to-gray-800 py-12 px-6 border-t border-gray-700">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <img
              src="https://lexiahealthacademy.nyc3.cdn.digitaloceanspaces.com/Imagenes-logos-iconos-Lexia/Logos/Logo-lexia.png"
              alt="Lexia"
              className="h-10 filter brightness-110"
            />
            <div className="w-px h-8 bg-gray-600"></div>
            <span className="text-gray-300 font-medium">
              Lexia Health Academy
            </span>
          </div>
          <p className="text-gray-400 text-sm">
            Copyright Ⓒ 2025 Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
