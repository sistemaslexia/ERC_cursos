// API Route para Meta Conversions API - Server-Side Events
import { NextResponse } from "next/server";
import { sendMetaEvent } from "@/lib/metaConversionsAPI";
import { isPixelConfigured } from "@/lib/pixelConfig";

export async function POST(request) {
  try {
    // Obtener datos del request
    const body = await request.json();
    const { eventName, eventData, userData } = body;

    // Validaciones básicas
    if (!eventName) {
      return NextResponse.json(
        { error: "eventName es requerido" },
        { status: 400 }
      );
    }

    // Enviar evento
    const result = await sendMetaEvent(eventName, eventData, userData);

    if (result?.success) {
      return NextResponse.json({
        success: true,
        message: `Evento ${eventName} enviado exitosamente`,
        event_id: result.eventId,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Error enviando evento a Meta",
          details: result?.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Error en API route meta-events:", error);

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

// Endpoint GET para verificar configuración
export async function GET() {
  try {
    const configured = isPixelConfigured();

    return NextResponse.json({
      status: "Meta Conversions API",
      configured,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error verificando configuración" },
      { status: 500 }
    );
  }
}
