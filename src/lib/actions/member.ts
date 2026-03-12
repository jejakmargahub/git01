"use server";

import { db } from "@/lib/db";
import { familyMembers, familyAccess } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function checkAccess(familyId: string, requiredRoles: string[]) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [access] = await db
    .select()
    .from(familyAccess)
    .where(
      and(
        eq(familyAccess.familyId, familyId),
        eq(familyAccess.userId, session.user.id)
      )
    )
    .limit(1);

  if (!access || !requiredRoles.includes(access.role)) {
    throw new Error("Tidak memiliki akses");
  }

  return access;
}

export async function createMember(familyId: string, formData: FormData) {
  await checkAccess(familyId, ["admin", "editor"]);

  const fullName = formData.get("fullName") as string;
  const nickname = formData.get("nickname") as string;
  const mandarinName = formData.get("mandarinName") as string;
  const photoUrl = formData.get("photoUrl") as string;
  const gender = formData.get("gender") as string;
  const rawBirth = formData.get("birthDate") as string;
  const rawDeath = formData.get("deathDate") as string;
  const birthDate = rawBirth ? `${rawBirth}-01` : null;
  const deathDate = rawDeath ? rawDeath : null;
  const title = formData.get("title") as string;
  const phone = formData.get("phone") as string;
  const bio = formData.get("bio") as string;

  if (!fullName || !gender) {
    throw new Error("Nama lengkap dan jenis kelamin wajib diisi");
  }

  const [member] = await db
    .insert(familyMembers)
    .values({
      familyId,
      fullName,
      nickname: nickname || null,
      mandarinName: mandarinName || null,
      photoUrl: photoUrl || null,
      gender,
      birthDate: birthDate || null,
      deathDate: deathDate || null,
      title: title || null,
      phone: phone || null,
      bio: bio || null,
    })
    .returning();

  revalidatePath(`/family/${familyId}`);
  return member;
}

export async function updateMember(
  familyId: string,
  memberId: string,
  formData: FormData
) {
  await checkAccess(familyId, ["admin", "editor"]);

  const fullName = formData.get("fullName") as string;
  const nickname = formData.get("nickname") as string;
  const mandarinName = formData.get("mandarinName") as string;
  const photoUrl = formData.get("photoUrl") as string;
  const gender = formData.get("gender") as string;
  const rawBirth = formData.get("birthDate") as string;
  const rawDeath = formData.get("deathDate") as string;
  const birthDate = rawBirth ? `${rawBirth}-01` : null;
  const deathDate = rawDeath ? rawDeath : null;
  const title = formData.get("title") as string;
  const phone = formData.get("phone") as string;
  const bio = formData.get("bio") as string;

  if (!fullName || !gender) {
    throw new Error("Nama lengkap dan jenis kelamin wajib diisi");
  }

  await db
    .update(familyMembers)
    .set({
      fullName,
      nickname: nickname || null,
      mandarinName: mandarinName || null,
      photoUrl: photoUrl || null,
      gender,
      birthDate: birthDate || null,
      deathDate: deathDate || null,
      title: title || null,
      phone: phone || null,
      bio: bio || null,
    })
    .where(
      and(
        eq(familyMembers.id, memberId),
        eq(familyMembers.familyId, familyId)
      )
    );

  revalidatePath(`/family/${familyId}`);
}

export async function deleteMember(familyId: string, memberId: string) {
  await checkAccess(familyId, ["admin", "editor"]);

  await db
    .delete(familyMembers)
    .where(
      and(
        eq(familyMembers.id, memberId),
        eq(familyMembers.familyId, familyId)
      )
    );

  revalidatePath(`/family/${familyId}`);
}

export async function getFamilyMembers(familyId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Check any access
  const [access] = await db
    .select()
    .from(familyAccess)
    .where(
      and(
        eq(familyAccess.familyId, familyId),
        eq(familyAccess.userId, session.user.id)
      )
    )
    .limit(1);

  if (!access) throw new Error("Tidak memiliki akses");

  const members = await db
    .select()
    .from(familyMembers)
    .where(eq(familyMembers.familyId, familyId))
    .orderBy(familyMembers.fullName);

  return members;
}
