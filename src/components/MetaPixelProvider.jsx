"use client";
import { useEffect } from "react";
import { initMetaPixel } from "@/lib/metaPixel";

export default function MetaPixelProvider() {
  useEffect(() => {
    // Obtener el pixel ID desde las variables de entorno
    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_DIABETES_BASICO;

    if (pixelId) {
      console.log("🎯 Inicializando Meta Pixel:", pixelId);
      initMetaPixel(pixelId);
    } else {
      console.warn("⚠️ Meta Pixel ID no encontrado en variables de entorno");
    }
  }, []);

  return null;
}
