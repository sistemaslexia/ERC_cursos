import { NextResponse } from "next/server";
import Stripe from "stripe";

// Validate that we have the required environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}

if (!process.env.NEXT_PUBLIC_APP_URL) {
  throw new Error(
    "NEXT_PUBLIC_APP_URL is not defined in environment variables"
  );
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!stripeSecret) {
      return NextResponse.json(
        { error: "Configuración de pagos no disponible" },
        { status: 500 }
      );
    }

    if (!appUrl) {
      return NextResponse.json(
        { error: "URL de la aplicación no configurada" },
        { status: 500 }
      );
    }

    const body = await request.json();

    // Validar que tenemos los items para la compra
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "No hay productos para comprar" },
        { status: 400 }
      );
    }

    // Create line items for products
    const lineItems = body.items.map((item) => ({
      price_data: {
        currency: "mxn",
        product_data: {
          name: item.name,
          description:
            item.description || `Acceso completo al curso: ${item.name}`,
          metadata: {
            course_slug: item.slug || item.courseSlug || "",
            course_id: item.courseId || item.id || "",
          },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    }));

    // Obtener el slug del curso (priorizar 'slug' sobre 'courseSlug')
    const courseSlug = body.items[0]?.slug || body.items[0]?.courseSlug || "";
    const courseName = body.items[0]?.name || "";
    const coursePrice = body.items[0]?.price || 0;

    console.log("💳 Creando sesión de Stripe con metadata:", {
      courseSlug,
      courseName,
      coursePrice,
    });

    if (!courseSlug) {
      console.error("❌ ADVERTENCIA: No se encontró course_slug en los items");
    }

    const session = await stripe.checkout.sessions.create({
      success_url: `${appUrl}/success?payment_intent={CHECKOUT_SESSION_ID}&course_id=${courseSlug}&amount=${coursePrice}&course_name=${encodeURIComponent(
        courseName
      )}`,
      cancel_url: `${appUrl}/cancel`,
      line_items: lineItems,
      mode: "payment",
      customer_creation: "always",
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      metadata: {
        course_slug: courseSlug,
        course_name: courseName,
        course_price: coursePrice.toString(),
      },
    });

    console.log("✅ Sesión de Stripe creada:", {
      sessionId: session.id,
      metadata: session.metadata,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error al procesar el pago",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
