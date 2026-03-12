import { NextResponse } from "next/server";
import { IS_DEMO_MODE } from "@/lib/demo-mode";
import { searchDemoMembers } from "@/lib/db/mock-data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [] });
    }

    // Demo mode
    if (IS_DEMO_MODE) {
      const results = searchDemoMembers(query.trim());
      return NextResponse.json({ results });
    }

    // Production mode
    const { auth } = await import("@/lib/auth");
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await import("@/lib/db");
    const { familyMembers, families, familyAccess } = await import("@/lib/db/schema");
    const { eq, or, ilike, and, inArray } = await import("drizzle-orm");

    const accessibleFamilies = await db
      .select({ familyId: familyAccess.familyId })
      .from(familyAccess)
      .where(eq(familyAccess.userId, session.user.id));

    const familyIds = accessibleFamilies.map((a) => a.familyId);

    if (familyIds.length === 0) {
      return NextResponse.json({ results: [] });
    }

    const searchPattern = `%${query.trim()}%`;
    const results = await db
      .select({
        id: familyMembers.id,
        fullName: familyMembers.fullName,
        nickname: familyMembers.nickname,
        gender: familyMembers.gender,
        title: familyMembers.title,
        deathDate: familyMembers.deathDate,
        familyId: familyMembers.familyId,
        familyName: families.name,
      })
      .from(familyMembers)
      .innerJoin(families, eq(familyMembers.familyId, families.id))
      .where(
        and(
          inArray(familyMembers.familyId, familyIds),
          or(
            ilike(familyMembers.fullName, searchPattern),
            ilike(familyMembers.nickname, searchPattern)
          )
        )
      )
      .limit(50);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}
