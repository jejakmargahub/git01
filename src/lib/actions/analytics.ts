"use server";

import { db } from "@/lib/db";
import { userSessions } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and, isNull } from "drizzle-orm";
import { headers } from "next/headers";
import { getLocationFromIP } from "@/lib/utils/geoip";

/**
 * Memulai sesi baru saat pengguna login atau membuka aplikasi
 */
export async function startUserSession() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0] || 
             headerList.get("x-real-ip") || 
             "127.0.0.1";
  const userAgent = headerList.get("user-agent") || "Unknown";

  const locationData = await getLocationFromIP(ip);
  
  const finalLocation = locationData.status === "success"
    ? [locationData.city, locationData.region, locationData.country].filter(Boolean).join(", ")
    : "Unknown Location";

  const [newSession] = await db.insert(userSessions).values({
    userId: session.user.id,
    ipAddress: ip,
    location: finalLocation,
    userAgent: userAgent,
    startTime: new Date(),
    lastPing: new Date(),
    duration: "0",
  }).returning({ id: userSessions.id });

  return newSession.id;
}

/**
 * Memperbarui 'lastPing' dan akumulasi durasi setiap 5 menit (atau interval lain)
 */
export async function updateSessionHeartbeat(sessionId: string, additionalSeconds: number) {
  const [session] = await db
    .select()
    .from(userSessions)
    .where(eq(userSessions.id, sessionId))
    .limit(1);

  if (!session) return { success: false };

  const currentDuration = parseInt(session.duration || "0");
  const newDuration = (currentDuration + additionalSeconds).toString();

  await db
    .update(userSessions)
    .set({
      lastPing: new Date(),
      duration: newDuration,
    })
    .where(eq(userSessions.id, sessionId));

  return { success: true };
}

/**
 * Mengakhiri sesi secara eksplisit saat logout
 */
export async function endUserSession(sessionId: string) {
  await db
    .update(userSessions)
    .set({
      endTime: new Date(),
      lastPing: new Date(),
    })
    .where(eq(userSessions.id, sessionId));

  return { success: true };
}
