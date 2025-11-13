import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { userService } from "@/lib/userService";
import { strapiClient } from "@/lib/strapi";
import { sendMetaEvent } from "@/lib/metaConversionsAPI";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    let event;

    // Verificar la firma del webhook de Stripe
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    // Manejar diferentes tipos de eventos
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object);
        break;

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session) {
  try {
    console.log("💳 Procesando compra completada:", {
      sessionId: session.id,
      amount: session.amount_total,
      currency: session.currency,
      metadata: session.metadata,
    });

    // Obtener información del cliente (email del comprador)
    const customerEmail = session.customer_details?.email;

    if (!customerEmail) {
      console.error("❌ Error: No se encontró email del cliente en la sesión");
      return;
    }

    // Buscar usuario por email en Strapi
    const userResponse = await userService.getUserByEmail(customerEmail);

    if (!userResponse) {
      console.error(
        "❌ Error: No se encontró usuario en Strapi:",
        customerEmail
      );
      return;
    }

    // Obtener el slug del curso desde el metadata de la sesión
    const courseSlug = session.metadata?.course_slug;

    console.log("📘 Datos de la compra:", {
      customerEmail,
      userId: userResponse.clerkId,
      courseSlug,
    });

    if (!courseSlug) {
      // Fallback: intentar obtener desde line items
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id,
        {
          expand: ["data.price.product"],
        }
      );

      if (lineItems.data && lineItems.data.length > 0) {
        const product = lineItems.data[0].price.product;
        const fallbackSlug = product.metadata?.course_slug;

        if (fallbackSlug && userResponse.clerkId) {
          await userService.addCursoBySlug(userResponse.clerkId, fallbackSlug);
        } else {
          // Último recurso: buscar por nombre
          const courseSlugByName = await findCourseSlugByName(product.name);
          if (courseSlugByName && userResponse.clerkId) {
            await userService.addCursoBySlug(
              userResponse.clerkId,
              courseSlugByName
            );
          }
        }
      }
      return;
    }

    // Agregar curso usando el slug
    if (userResponse.clerkId) {
      const result = await userService.addCursoBySlug(
        userResponse.clerkId,
        courseSlug
      );

      // Enviar evento de Purchase al pixel del curso
      try {
        console.log("🎯 Iniciando tracking de compra en Meta");
        console.log("📋 Course slug recibido:", courseSlug);

        if (!hasCoursePixel(courseSlug)) {
          console.warn(
            "⚠️ No hay configuración de pixel específica para el curso:",
            courseSlug
          );
          console.log("� Se usará el pixel por defecto");
        }

        const eventId = `purchase_${session.id}_${Date.now()}`;
        const purchaseData = {
          custom_data: {
            currency: session.currency?.toUpperCase() || "MXN",
            value: parseFloat((session.amount_total / 100).toFixed(2)),
            content_name: courseSlug,
            content_type: "product",
            content_ids: [courseSlug],
            course_slug: courseSlug,
            session_id: session.id,
            payment_status: session.payment_status,
          },
        };

        const result = await sendMetaEvent("Purchase", purchaseData, {
          email: customerEmail,
          userId: userResponse.clerkId,
        });

        if (result.success) {
          console.log("✅ Evento de compra enviado a Meta exitosamente");
        } else {
          console.error("❌ Error enviando evento a Meta:", result.error);
        }
      } catch (metaError) {
        console.error("❌ Error en tracking de Meta:", metaError);
      }
    }
  } catch (error) {
    console.error("❌ Error manejando compra completada:", error);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent) {
  try {
    const courseId = paymentIntent.metadata?.courseId;
    if (courseId) {
      // Lógica adicional si es necesaria
    }
  } catch (error) {
    console.error("Error handling payment intent:", error);
  }
}

async function handlePaymentIntentFailed(paymentIntent) {
  // Lógica para manejar pagos fallidos si es necesaria
}

// Función auxiliar para encontrar el slug del curso por nombre
async function findCourseSlugByName(productName) {
  try {
    // Obtener todos los cursos y buscar por nombre
    const coursesResponse = await strapiClient.getCursos();
    if (!coursesResponse.data) {
      return null;
    }

    const course = coursesResponse.data.find(
      (course) =>
        course.nombre.toLowerCase().includes(productName.toLowerCase()) ||
        productName.toLowerCase().includes(course.nombre.toLowerCase())
    );

    return course?.slug || null;
  } catch (error) {
    console.error("Error finding course by name:", error);
    return null;
  }
}
