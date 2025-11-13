import { NextResponse } from "next/server";
import { sendMetaEvent } from "@/lib/metaConversionsAPI";
import { getPixelConfig, isPixelConfigured } from "@/lib/pixelConfig";

export async function GET() {
  const config = getPixelConfig();
  const configured = isPixelConfigured();
  return NextResponse.json({
    configured,
    hasPixelId: !!config.pixelId,
    hasToken: !!config.accessToken,
    hasTestCode: !!config.testCode,
    timestamp: new Date().toISOString(),
  });
}

export async function POST() {
  console.log("🧪 Probando envío de evento Purchase a Meta Conversions API");

  const result = await sendMetaEvent(
    "Purchase",
    {
      custom_data: {
        currency: "MXN",
        value: 299.0,
        content_name: "curso-basico-de-diabetes",
        content_type: "product",
        content_ids: ["curso-basico-de-diabetes"],
        test_event: true,
        test_timestamp: new Date().toISOString(),
      },
    },
    {
      email: "test@example.com",
      userId: "test-user-123",
      firstName: "Test",
      lastName: "User",
    }
  );

  return NextResponse.json({
    success: result.success,
    eventId: result.eventId,
    result: result,
    timestamp: new Date().toISOString(),
    message: result.success
      ? "✅ Evento enviado exitosamente. Verifica en Meta Events Manager > Test Events con el código TEST88124"
      : "❌ Error enviando evento. Revisa los logs del servidor.",
  });
}
