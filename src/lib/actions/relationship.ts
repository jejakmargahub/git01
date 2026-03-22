"use server";

import { db } from "@/lib/db";
import { relationships, familyMembers, familyAccess, families } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and, or, sql } from "drizzle-orm";
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

  // Dynamic Menantu (In-law) calculation
  // 1. Get children of this member (from the already fetched rels where type is 'parent')
  const childrenIds = rels
    .filter((r: any) => r.relationType === "parent")
    .map((r: any) => r.toMemberId);

  if (childrenIds.length > 0) {
    // 2. Find spouses of these children
    const inLawRels = await db
      .select({
        id: relationships.id,
        relationType: relationships.relationType, // We will override this in the map
        fromMemberId: relationships.fromMemberId,
        toMemberId: relationships.toMemberId,
        relatedMember: familyMembers,
      })
      .from(relationships)
      .innerJoin(
        familyMembers,
        eq(relationships.toMemberId, familyMembers.id)
      )
      .where(
        and(
          eq(relationships.familyId, familyId),
          or(...childrenIds.map((id: any) => eq(relationships.fromMemberId, id))),
          eq(relationships.relationType, "spouse")
        )
      );

    // 3. Mark them as 'menantu' and append to results
    const menantuRels = inLawRels.map((r: any) => ({
      ...r,
      relationType: "menantu"
    }));
    
    rels.push(...menantuRels as any);
  }

  // Dynamic Derived Relationships (Spouse's Children & Parent's Spouses)
  
  // 1. Children of Spouses (Step-children/Partners' children)
  const spouseIds = rels
    .filter((r: any) => r.relationType === "spouse")
    .map((r: any) => r.toMemberId);

  if (spouseIds.length > 0) {
    const spouseChildrenRels = await db
      .select({
        id: relationships.id,
        relationType: sql<string>`'parent'`, // Treat as my child
        fromMemberId: sql<string>`${memberId}`,
        toMemberId: relationships.toMemberId,
        relatedMember: familyMembers,
      })
      .from(relationships)
      .innerJoin(
        familyMembers,
        eq(relationships.toMemberId, familyMembers.id)
      )
      .where(
        and(
          eq(relationships.familyId, familyId),
          or(...spouseIds.map((id: any) => eq(relationships.fromMemberId, id))),
          eq(relationships.relationType, "parent")
        )
      );

    // Filter out if already in rels as a direct child
    const existingChildIds = new Set(rels.filter((r: any) => r.relationType === "parent").map((r: any) => r.toMemberId));
    const newSpouseChildren = (spouseChildrenRels as any[]).filter(r => !existingChildIds.has(r.toMemberId));
    
    rels.push(...newSpouseChildren);
  }

  // 2. Spouses of Parents (Step-parents/Partners' parents)
  const parentIds = rels
    .filter((r: any) => r.relationType === "child")
    .map((r: any) => r.toMemberId);

  if (parentIds.length > 0) {
    const parentSpouseRels = await db
      .select({
        id: relationships.id,
        relationType: sql<string>`'child'`, // I am their child
        fromMemberId: sql<string>`${memberId}`,
        toMemberId: relationships.toMemberId,
        relatedMember: familyMembers,
      })
      .from(relationships)
      .innerJoin(
        familyMembers,
        eq(relationships.toMemberId, familyMembers.id)
      )
      .where(
        and(
          eq(relationships.familyId, familyId),
          or(...parentIds.map((id: any) => eq(relationships.fromMemberId, id))),
          eq(relationships.relationType, "spouse")
        )
      );

    // Filter out if already in rels as a direct parent
    const existingParentIds = new Set(rels.filter((r: any) => r.relationType === "child").map((r: any) => r.toMemberId));
    const newParentSpouses = (parentSpouseRels as any[]).filter(r => !existingParentIds.has(r.toMemberId));

    rels.push(...newParentSpouses);
  }

  // Sanitize if public
  if (!session?.user?.id && isPublic) {
    return rels.map((r: any) => ({
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
