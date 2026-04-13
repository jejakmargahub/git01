"use server";

import { db } from "@/lib/db";
import { familyPhotos, photoTags, familyAccess } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Upload a photo to the family gallery
 */
export async function uploadToGallery(familyId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Check if user has edit access (admin or editor)
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

  if (!access || access.role === "viewer") throw new Error("Tidak memiliki izin untuk mengunggah ke galeri");

  const url = formData.get("url") as string;
  const thumbnailUrl = formData.get("thumbnailUrl") as string;
  const caption = formData.get("caption") as string;
  const takenAtStr = formData.get("takenAt") as string;

  if (!url) throw new Error("URL foto wajib ada");

  const [photo] = await db
    .insert(familyPhotos)
    .values({
      familyId,
      url,
      thumbnailUrl: thumbnailUrl || null,
      caption: caption || null,
      takenAt: takenAtStr ? new Date(takenAtStr) : null,
      uploadedById: session.user.id,
    })
    .returning();

  revalidatePath(`/family/${familyId}/gallery`);
  return photo;
}

/**
 * Tag a family member in a gallery photo
 */
export async function tagMemberInPhoto(familyId: string, photoId: string, memberId: string, xPos: number, yPos: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Check edit access
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

  if (!access || access.role === "viewer") throw new Error("Tidak memiliki izin untuk menandai foto");

  const [tag] = await db
    .insert(photoTags)
    .values({
      photoId,
      memberId,
      xPos,
      yPos,
    })
    .returning();

  revalidatePath(`/family/${familyId}/gallery`);
  return tag;
}

/**
 * Get all photos for a family
 */
export async function getFamilyPhotos(familyId: string) {
  const photos = await db
    .select()
    .from(familyPhotos)
    .where(eq(familyPhotos.familyId, familyId))
    .orderBy(desc(familyPhotos.createdAt));

  return photos;
}

/**
 * Get photos where a specific member is tagged
 */
export async function getMemberPhotos(memberId: string) {
  const tags = await db
    .select({
      photo: familyPhotos
    })
    .from(photoTags)
    .innerJoin(familyPhotos, eq(photoTags.photoId, familyPhotos.id))
    .where(eq(photoTags.memberId, memberId))
    .orderBy(desc(familyPhotos.createdAt));

  return tags.map(t => t.photo);
}
