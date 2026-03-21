"use server";

import { db } from "@/lib/db";
import { relationships, familyMembers, familyAccess, families } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function checkEditAccess(familyId: string) {
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

  if (!access || !["admin", "editor"].includes(access.role)) {
    throw new Error("Tidak memiliki akses");
  }

  return access;
}

export async function addRelationship(
  familyId: string,
  fromMemberId: string,
  toMemberId: string,
  relationType: string
) {
  await checkEditAccess(familyId);

  if (fromMemberId === toMemberId) {
    throw new Error("Tidak bisa membuat hubungan dengan diri sendiri");
  }

  // Check both members belong to this family
  const members = await db
    .select()
    .from(familyMembers)
    .where(
      and(
        eq(familyMembers.familyId, familyId),
        or(
          eq(familyMembers.id, fromMemberId),
          eq(familyMembers.id, toMemberId)
        )
      )
    );

  if (members.length !== 2) {
    throw new Error("Anggota tidak valid");
  }

  const [rel] = await db
    .insert(relationships)
    .values({
      familyId,
      fromMemberId,
      toMemberId,
      relationType,
    })
    .returning();

  // If adding parent relationship, also add child relationship (reverse)
  if (relationType === "parent") {
    await db.insert(relationships).values({
      familyId,
      fromMemberId: toMemberId,
      toMemberId: fromMemberId,
      relationType: "child",
    });
  } else if (relationType === "child") {
    await db.insert(relationships).values({
      familyId,
      fromMemberId: toMemberId,
      toMemberId: fromMemberId,
      relationType: "parent",
    });
  } else if (relationType === "spouse") {
    // Add reverse spouse relationship
    await db.insert(relationships).values({
      familyId,
      fromMemberId: toMemberId,
      toMemberId: fromMemberId,
      relationType: "spouse",
    });
  }

  revalidatePath(`/family/${familyId}`);
  return rel;
}

export async function removeRelationship(familyId: string, relationshipId: string) {
  await checkEditAccess(familyId);

  // Get the relationship to find and remove the reverse
  const [rel] = await db
    .select()
    .from(relationships)
    .where(
      and(
        eq(relationships.id, relationshipId),
        eq(relationships.familyId, familyId)
      )
    )
    .limit(1);

  if (!rel) throw new Error("Hubungan tidak ditemukan");

  // Determine reverse relation type
  let reverseType = rel.relationType;
  if (rel.relationType === "parent") reverseType = "child";
  else if (rel.relationType === "child") reverseType = "parent";

  // Delete both the relationship and its reverse
  await db
    .delete(relationships)
    .where(eq(relationships.id, relationshipId));

  await db
    .delete(relationships)
    .where(
      and(
        eq(relationships.familyId, familyId),
        eq(relationships.fromMemberId, rel.toMemberId),
        eq(relationships.toMemberId, rel.fromMemberId),
        eq(relationships.relationType, reverseType)
      )
    );

  revalidatePath(`/family/${familyId}`);
}

export async function getMemberRelationships(familyId: string, memberId: string) {
  const session = await auth();
  
  // Check if it's a public family
  const [family] = await db
    .select({ isPublicViewEnabled: families.isPublicViewEnabled })
    .from(families)
    .where(eq(families.id, familyId))
    .limit(1);

  const isPublic = family?.isPublicViewEnabled === true;

  if (!session?.user?.id && !isPublic) {
    throw new Error("Unauthorized");
  }

  // If authenticated, check if member has access to this family
  if (session?.user?.id && !isPublic) {
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
    if (!access) throw new Error("Unauthorized");
  }

  const rels = await db
    .select({
      id: relationships.id,
      relationType: relationships.relationType,
      fromMemberId: relationships.fromMemberId,
      toMemberId: relationships.toMemberId,
      relatedMember: familyMembers,
    })
    .from(relationships)
    .innerJoin(
      familyMembers,
      and(
        eq(relationships.toMemberId, familyMembers.id)
      )
    )
    .where(
      and(
        eq(relationships.familyId, familyId),
        eq(relationships.fromMemberId, memberId)
      )
    );

  // Sanitize if public
  if (!session?.user?.id && isPublic) {
    return rels.map(r => ({
      ...r,
      relatedMember: {
        ...r.relatedMember,
        phone: null,
        bio: null
      }
    }));
  }

  return rels;
}

export async function getAllRelationships(familyId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const rels = await db
    .select()
    .from(relationships)
    .where(eq(relationships.familyId, familyId));

  return rels;
}
