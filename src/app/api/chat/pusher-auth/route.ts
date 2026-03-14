import { getPusherServer } from "@/lib/pusher";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { familyAccess } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.formData();
    const socketId = body.get("socket_id") as string;
    const channelName = body.get("channel_name") as string;

    // Expected channel format: private-family-{familyId}
    const familyId = channelName.split("family-")[1];

    if (!familyId) {
      return new Response("Invalid channel name", { status: 400 });
    }

    // Verify user has access to this family
    const userId = session.user.id;
    if (!userId || !familyId) {
      return new Response("Invalid request", { status: 400 });
    }

    const access = await db.query.familyAccess.findFirst({
      where: and(
        eq(familyAccess.familyId, familyId),
        eq(familyAccess.userId, userId)
      ),
    });

    if (!access) {
      return new Response("No access to this family", { status: 403 });
    }

    const authResponse = getPusherServer().authorizeChannel(socketId, channelName);
    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("Pusher Auth Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
