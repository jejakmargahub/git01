"use server";

import { db } from "@/lib/db";
import { messages, familyAccess } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { and, eq, desc } from "drizzle-orm";
import { getPusherServer } from "@/lib/pusher";

/**
 * Send a message to the family chat
 */
/**
 * Send a message to the family chat
 * NOTE: guestName is temporary for testing shared sessions (bypass).
 * To remove: Delete guestName param and the if block that modifies finalContent.
 */
export async function sendMessage(familyId: string, content: string, guestName?: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Verify access
  const access = await db.query.familyAccess.findFirst({
    where: and(
      eq(familyAccess.familyId, familyId),
      eq(familyAccess.userId, session.user.id)
    ),
  });

  if (!access) throw new Error("No access to this family chat");

  // Temporary: Prepend name if guestName is provided for testing
  let finalContent = content;
  if (guestName) {
    finalContent = `[${guestName}]: ${content}`;
  }

  // Save to DB
  const [newMessage] = await db
    .insert(messages)
    .values({
      familyId,
      senderId: session.user.id,
      content: finalContent,
    })
    .returning();

  const messageWithSender = {
    ...newMessage,
    sender: {
      id: session.user.id,
      fullName: guestName || session.user.name || "Unknown",
      image: session.user.image,
    },
  };

  // Trigger Pusher event
  await getPusherServer().trigger(`private-family-${familyId}`, "new-message", messageWithSender);

  return messageWithSender;
}

/**
 * Fetch chat history for a family
 */
export async function getMessages(familyId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Verify access
  const access = await db.query.familyAccess.findFirst({
    where: and(
      eq(familyAccess.familyId, familyId),
      eq(familyAccess.userId, session.user.id)
    ),
  });

  if (!access) throw new Error("No access to this family chat");

  return await db.query.messages.findMany({
    where: eq(messages.familyId, familyId),
    with: {
      sender: {
         columns: {
           id: true,
           fullName: true,
         }
      }
    },
    orderBy: [desc(messages.createdAt)],
    limit: 50,
  });
}
