// API para eventos automáticos de Meta Pixel
import { NextResponse } from "next/server";
import { getMetaPixel } from "@/lib/metaPixel";

// Variables para controlar el sistema automático
let autoInterval = null;
let isAutoRunning = false;
let eventCount = 0;

// Función para generar evento de compra automático ($1)
async function generateAutoPurchase() {
  const pixel = getMetaPixel();
  if (!pixel) {
    throw new Error("Meta Pixel no inicializado");
  }

  // Datos del evento automático ($1 para mantener pixel activo)
  const autoData = {
    courseId: "auto-course-" + Date.now(),
    courseName: `Curso Automático ${eventCount + 1}`,
    price: 1, // $1 USD
    transactionId: "auto_" + Date.now(),
    userId: "auto-user-" + Math.random().toString(36).substr(2, 9),
  };

  const userData = {
    userId: autoData.userId,
    email: "auto@cursolexia.com",
    firstName: "Sistema",
    lastName: "Automático",
  };

  try {
    const result = await pixel.trackPurchase(
      {
        content_ids: [autoData.courseId],
        content_name: autoData.courseName,
        value: autoData.price,
        currency: "USD",
        transaction_id: autoData.transactionId,
        custom_data: {
          auto_event: true,
          generated_at: new Date().toISOString(),
          event_number: eventCount + 1,
        },
      },
      userData
    );

    eventCount++;

    return {
      success: true,
      eventNumber: eventCount,
      data: autoData,
      result,
    };
  } catch (error) {
    console.error("Error generando evento automático:", error);
    throw error;
  }
}

// POST - Controlar sistema automático
export async function POST(request) {
  try {
    const { action, interval = 120 } = await request.json(); // Default 2 minutos

    if (action === "start") {
      if (isAutoRunning) {
        return NextResponse.json({
          success: false,
          message: "Sistema automático ya está activo",
          status: "running",
          eventCount,
        });
      }

      // Enviar primer evento inmediatamente
      const firstEvent = await generateAutoPurchase();

      // Configurar intervalo para eventos automáticos
      autoInterval = setInterval(async () => {
        try {
          await generateAutoPurchase();
        } catch (error) {
          console.error("Error en evento automático:", error);
        }
      }, interval * 1000);

      isAutoRunning = true;

      return NextResponse.json({
        success: true,
        message: `Sistema automático iniciado (cada ${interval}s)`,
        status: "started",
        eventCount,
        firstEvent: firstEvent.data,
        intervalSeconds: interval,
      });
    } else if (action === "stop") {
      if (autoInterval) {
        clearInterval(autoInterval);
        autoInterval = null;
      }

      isAutoRunning = false;

      return NextResponse.json({
        success: true,
        message: "Sistema automático detenido",
        status: "stopped",
        totalEventsSent: eventCount,
      });
    } else if (action === "send_one") {
      // Enviar un solo evento manual
      const manualEvent = await generateAutoPurchase();

      return NextResponse.json({
        success: true,
        message: "Evento manual enviado",
        eventData: manualEvent.data,
        eventNumber: eventCount,
        result: manualEvent.result,
      });
    } else {
      return NextResponse.json(
        { error: "Acción no válida. Use: start, stop, o send_one" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error en API de eventos automáticos:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// GET - Estado actual del sistema
export async function GET() {
  try {
    return NextResponse.json({
      status: isAutoRunning ? "running" : "stopped",
      isActive: isAutoRunning,
      totalEvents: eventCount,
      message: isAutoRunning
        ? "Sistema automático activo - mantiene pixel de Meta activo"
        : "Sistema automático inactivo",
      info: {
        purpose: "Mantener el pixel de Meta activo con eventos de $1",
        frequency: "Cada 2 minutos por defecto",
        value: "$1 USD por evento",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error obteniendo estado" },
      { status: 500 }
    );
  }
}
