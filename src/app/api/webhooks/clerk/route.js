import { Webhook } from "svix";
import { headers } from "next/headers";
import { userService } from "@/lib/userService";

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Agregar CLERK_WEBHOOK_SECRET del dashboard de Clerk al archivo .env.local"
    );
  }

  // Obtener headers de la solicitud
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Si faltan headers, es un error
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return Response.json(
      { error: "Error -- faltan svix headers" },
      { status: 400 }
    );
  }

  // Obtener el cuerpo
  const payload = await req.text();
  const body = JSON.parse(payload);

  // Crear una nueva instancia de Svix con tu secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  // Verificar el payload con los headers
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verificando webhook:", err);
    return Response.json(
      { error: "Error -- Webhook no verificado" },
      { status: 400 }
    );
  }

  // Manejar diferentes tipos de eventos
  const { id } = evt.data;
  const eventType = evt.type;

  try {
    switch (eventType) {
      case "user.created":
        // Crear usuario en Strapi cuando se registre en Clerk
        const email = evt.data.email_addresses[0]?.email_address;
        const firstName = evt.data.first_name;
        const lastName = evt.data.last_name;

        // Verificar si tenemos datos válidos (skip eventos de test sin email)
        if (!email && !firstName && !lastName) {
          return Response.json(
            { received: true, skipped: "test event" },
            { status: 200 }
          );
        }

        // Generar email de test si no existe (solo para testing)
        const finalEmail = email || `${evt.data.id}@test.clerk.dev`;

        const userData = {
          clerkId: evt.data.id,
          email: finalEmail,
          nombre:
            `${firstName || ""} ${lastName || ""}`.trim() ||
            finalEmail.split("@")[0] ||
            "Usuario Test",
          password: null, // Clerk maneja la autenticación
        };

        const newUser = await userService.createUserFromClerk(userData);
        break;

      case "user.updated":
        // Actualizar usuario en Strapi cuando se actualice en Clerk
        const updateEmail = evt.data.email_addresses[0]?.email_address;
        const updateFirstName = evt.data.first_name;
        const updateLastName = evt.data.last_name;

        // Verificar si tenemos datos válidos
        if (!updateEmail && !updateFirstName && !updateLastName) {
          return Response.json(
            { received: true, skipped: "test event" },
            { status: 200 }
          );
        }

        const updatedUserData = {
          email: updateEmail || `${evt.data.id}@test.clerk.dev`,
          nombre:
            `${updateFirstName || ""} ${updateLastName || ""}`.trim() ||
            (updateEmail ? updateEmail.split("@")[0] : "Usuario Test"),
        };

        const updatedUser = await userService.updateUserByClerkId(
          evt.data.id,
          updatedUserData
        );
        break;

      case "user.deleted":
        // Marcar usuario como inactivo en Strapi (opcional)

        // Aquí podrías implementar lógica para desactivar el usuario en Strapi
        break;

      default:
    }
  } catch (error) {
    console.error("Error procesando webhook:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }

  return Response.json({ received: true }, { status: 200 });
}
