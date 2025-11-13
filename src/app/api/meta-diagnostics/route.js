import { NextResponse } from "next/server";
import { getPixelConfig, isPixelConfigured } from "@/lib/pixelConfig";

export async function GET() {
  try {
    const config = getPixelConfig();
    const configured = isPixelConfigured();

    // Diagnóstico completo
    const diagnostics = {
      configured,
      pixelId: config.pixelId || "NO CONFIGURADO",
      hasAccessToken: !!config.accessToken,
      hasTestCode: !!config.testCode,
      accessTokenLength: config.accessToken?.length || 0,
      environment: {
        NEXT_PUBLIC_META_PIXEL_DIABETES_BASICO:
          process.env.NEXT_PUBLIC_META_PIXEL_DIABETES_BASICO || "NO SET",
        META_CONVERSION_API_TOKEN_DIABETES_BASICO_EXISTS:
          !!process.env.META_CONVERSION_API_TOKEN_DIABETES_BASICO,
        META_CONVERSION_API_TEST_CODE_DIABETES_BASICO:
          process.env.META_CONVERSION_API_TEST_CODE_DIABETES_BASICO || "NO SET",
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(diagnostics);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error en diagnóstico",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
