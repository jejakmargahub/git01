import { db } from "@/lib/db";
import { families, familyMembers, relationships } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import PublicViewClient from "./PublicViewClient";

interface PublicPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicPage({ params }: PublicPageProps) {
  const { slug } = await params;

  // 1. Fetch family by public slug
  const [family] = await db
    .select()
    .from(families)
    .where(
      and(
        eq(families.publicViewSlug, slug),
        eq(families.isPublicViewEnabled, true)
      )
    )
    .limit(1);

  if (!family) {
    notFound();
  }

  // 2. Fetch members and relationships
  const members = await db
    .select()
    .from(familyMembers)
    .where(eq(familyMembers.familyId, family.id));

  const rels = await db
    .select()
    .from(relationships)
    .where(eq(relationships.familyId, family.id));

  // 3. Data Sanitization (Privacy Layer)
  const sanitizedMembers = members.map((m: any) => ({
    ...m,
    phone: null, // Hide phone numbers
    bio: null, // Hide bio for public view
  }));

  return (
    <div className="min-h-screen bg-background">
      <PublicViewClient 
        family={family} 
        members={sanitizedMembers} 
        relationships={rels} 
      />
    </div>
  );
}
