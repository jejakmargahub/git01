import { db } from "@/lib/db";
import { families, familyMembers, relationships, familyAccess, ethnicities } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { IS_DEMO_MODE } from "@/lib/demo-mode";
import { getDemoFamily, getDemoMembers, getDemoRelationships, getDemoAccess, DEMO_USER } from "@/lib/db/mock-data";
import FamilyPageClient from "./FamilyPageClient";
import { getEthnicities } from "@/lib/actions/ethnicity";

export default async function FamilyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Demo mode: use mock data
  if (IS_DEMO_MODE) {
    const family = getDemoFamily(id);
    if (!family) notFound();

    const members = getDemoMembers(id);
    const rels = getDemoRelationships(id);
    const access = getDemoAccess(id, DEMO_USER.id);

    return (
      <FamilyPageClient
        family={family}
        members={members}
        relationships={rels}
        userRole={access?.role || "viewer"}
        ethnicities={[]}
      />
    );
  }

  // Production mode: use database
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [access] = await db
    .select()
    .from(familyAccess)
    .where(
      and(eq(familyAccess.familyId, id), eq(familyAccess.userId, session.user.id))
    )
    .limit(1);

  if (!access) notFound();

  const [family] = await db
    .select()
    .from(families)
    .where(eq(families.id, id))
    .limit(1);

  if (!family) notFound();

  const members = await db
    .select({
      id: familyMembers.id,
      familyId: familyMembers.familyId,
      fullName: familyMembers.fullName,
      nickname: familyMembers.nickname,
      mandarinName: familyMembers.mandarinName,
      regionalName: familyMembers.regionalName,
      photoUrl: familyMembers.photoUrl,
      gender: familyMembers.gender,
      birthDate: familyMembers.birthDate,
      deathDate: familyMembers.deathDate,
      title: familyMembers.title,
      phone: familyMembers.phone,
      bio: familyMembers.bio,
      ethnicityId: familyMembers.ethnicityId,
      ethnicity: {
        id: ethnicities.id,
        name: ethnicities.name,
        scriptName: ethnicities.scriptName,
        labelName: ethnicities.labelName,
        fontFamily: ethnicities.fontFamily,
        isRtl: ethnicities.isRtl,
      }
    })
    .from(familyMembers)
    .leftJoin(ethnicities, eq(familyMembers.ethnicityId, ethnicities.id))
    .where(eq(familyMembers.familyId, id))
    .orderBy(familyMembers.fullName);

  const rels = await db
    .select()
    .from(relationships)
    .where(eq(relationships.familyId, id));

  const ethnicitiesData = await getEthnicities();

  return (
    <FamilyPageClient
      family={family}
      members={members}
      relationships={rels}
      userRole={access.role}
      ethnicities={ethnicitiesData}
    />
  );
}
