"use server";

import { db } from "@/lib/db";
import { families, familyAccess, familyMembers } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { eq, and, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createFamily(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) throw new Error("Nama bagan wajib diisi");

  const [family] = await db
    .insert(families)
    .values({
      name,
      description: description || null,
      createdBy: session.user.id,
    })
    .returning();

  // Auto-assign creator as admin
  await db.insert(familyAccess).values({
    familyId: family.id,
    userId: session.user.id,
    role: "admin",
  });

  revalidatePath("/dashboard");
  return family;
}

export async function updateFamily(familyId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Check admin access
  const [access] = await db
    .select()
    .from(familyAccess)
    .where(
      and(
        eq(familyAccess.familyId, familyId),
        eq(familyAccess.userId, session.user.id),
        eq(familyAccess.role, "admin")
      )
    )
    .limit(1);

  if (!access) throw new Error("Tidak memiliki akses admin");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  await db
    .update(families)
    .set({ name, description: description || null })
    .where(eq(families.id, familyId));

  revalidatePath("/dashboard");
  revalidatePath(`/family/${familyId}`);
}

export async function deleteFamily(familyId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Check admin access
  const [access] = await db
    .select()
    .from(familyAccess)
    .where(
      and(
        eq(familyAccess.familyId, familyId),
        eq(familyAccess.userId, session.user.id),
        eq(familyAccess.role, "admin")
      )
    )
    .limit(1);

  if (!access) throw new Error("Tidak memiliki akses admin");

  await db.delete(families).where(eq(families.id, familyId));
  revalidatePath("/dashboard");
}

export async function getUserFamilies() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const userAccess = await db
    .select({
      family: families,
      role: familyAccess.role,
      memberCount: count(familyMembers.id),
    })
    .from(familyAccess)
    .innerJoin(families, eq(familyAccess.familyId, families.id))
    .leftJoin(familyMembers, eq(families.id, familyMembers.familyId))
    .where(eq(familyAccess.userId, session.user.id))
    .groupBy(families.id, familyAccess.role);

  return userAccess;
}

export async function generateInviteCode(familyId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Check admin access
  const [access] = await db
    .select()
    .from(familyAccess)
    .where(
      and(
        eq(familyAccess.familyId, familyId),
        eq(familyAccess.userId, session.user.id),
        eq(familyAccess.role, "admin")
      )
    )
    .limit(1);

  if (!access) throw new Error("Tidak memiliki izin admin untuk membuat kode undangan");

  const newCode = `JM-${uuidv4().split("-")[0].toUpperCase()}`;

  await db
    .update(families)
    .set({ inviteCode: newCode })
    .where(eq(families.id, familyId));

  revalidatePath(`/family/${familyId}`);
  return newCode;
}

export async function joinFamily(inviteCode: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Silakan masuk terlebih dahulu untuk bergabung");

  // Cari family berdasarkan kode
  const [family] = await db
    .select()
    .from(families)
    .where(eq(families.inviteCode, inviteCode))
    .limit(1);

  if (!family) throw new Error("Kode undangan tidak valid atau sudah kadaluarsa");

  // Cek apakah user sudah pernah gabung
  const [existingAccess] = await db
    .select()
    .from(familyAccess)
    .where(
      and(
        eq(familyAccess.familyId, family.id),
        eq(familyAccess.userId, session.user.id)
      )
    )
    .limit(1);

  if (existingAccess) return family.id; // Already joined, return safely

  // Berikan akses editor secara default untuk anggota keluarga yang diundang
  await db.insert(familyAccess).values({
    familyId: family.id,
    userId: session.user.id,
    role: "editor",
  });

  revalidatePath("/dashboard");
  return family.id;
}
