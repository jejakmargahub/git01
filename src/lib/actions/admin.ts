"use server";

import { db } from "@/lib/db";
import { users, families, familyAccess, userSessions } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, sql, count, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Memastikan pemanggil adalah Super Admin.
 */
async function ensureSuperAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "superadmin") {
    throw new Error("Akses ditolak: Anda bukan Super Admin.");
  }
  return session;
}

/**
 * Mengambil daftar semua pengguna beserta statistik ringkasan.
 */
export async function getAllUsers() {
  await ensureSuperAdmin();

  // Query untuk mengambil user dan menghitung jumlah keluarga yang dibuat/diakses
  const allUsers = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      phoneNumber: users.phoneNumber,
      role: users.role,
      status: users.status,
      createdAt: users.createdAt,
      ownedFamiliesCount: sql<number>`(SELECT count(*) FROM ${families} WHERE ${families.createdBy} = ${users.id})`,
      accessedFamiliesCount: sql<number>`(SELECT count(*) FROM ${familyAccess} WHERE ${familyAccess.userId} = ${users.id})`,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  return allUsers;
}

/**
 * Mengambil data analitik penggunaan dan keamanan untuk Tab 2.
 */
export async function getUserAnalytics() {
  await ensureSuperAdmin();

  const analytics = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      phoneNumber: users.phoneNumber,
      createdAt: users.createdAt,
      totalDuration: sql<number>`COALESCE(SUM(CAST(${userSessions.duration} AS INTEGER)), 0)`,
      lastLogin: sql<Date | null>`MAX(${userSessions.startTime})`,
      lastPing: sql<Date | null>`MAX(${userSessions.lastPing})`,
      lastLocation: sql<string | null>`(
        SELECT location FROM ${userSessions} 
        WHERE ${userSessions.userId} = ${users.id} 
        ORDER BY ${userSessions.startTime} DESC 
        LIMIT 1
      )`,
      lastIp: sql<string | null>`(
        SELECT ip_address FROM ${userSessions} 
        WHERE ${userSessions.userId} = ${users.id} 
        ORDER BY ${userSessions.startTime} DESC 
        LIMIT 1
      )`,
    })
    .from(users)
    .leftJoin(userSessions, eq(users.id, userSessions.userId))
    .groupBy(users.id, users.fullName, users.email, users.phoneNumber, users.createdAt)
    .orderBy(desc(sql`MAX(${userSessions.startTime})`));

  return analytics;
}

/**
 * Memperbarui status akun pengguna (Active/Disabled).
 */
export async function updateUserStatus(userId: string, status: "active" | "disabled") {
  await ensureSuperAdmin();

  await db
    .update(users)
    .set({ status })
    .where(eq(users.id, userId));

  revalidatePath("/admin/users");
  return { success: true };
}

/**
 * Mengambil statistik ringkasan platform untuk dashboard admin.
 */
export async function getPlatformStats() {
  await ensureSuperAdmin();

  const [usersCount] = await db.select({ count: count() }).from(users);
  const [familiesCount] = await db.select({ count: count() }).from(families);
  const [activeUsers] = await db
    .select({ count: count() })
    .from(users)
    .where(eq(users.status, "active"));

  return {
    totalUsers: usersCount.count,
    totalFamilies: familiesCount.count,
    activeUsers: activeUsers.count,
    disabledUsers: usersCount.count - activeUsers.count,
  };
}
