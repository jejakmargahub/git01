
import { db } from "./src/lib/db";
import { relationships, familyMembers } from "./src/lib/db/schema";
import { eq, and } from "drizzle-orm";

async function checkAliceSpouse() {
  const aliceId = "db3fd762-c516-4914-9813-179574d245e2";
  const rels = await db.select().from(relationships).where(
    and(
      eq(relationships.fromMemberId, aliceId),
      eq(relationships.relationType, "spouse")
    )
  );
  console.log(`--- ALICE SPOUSES (${rels.length}) ---`);
  for (const r of rels) {
    const [spouse] = await db.select().from(familyMembers).where(eq(familyMembers.id, r.toMemberId));
    console.log(`- ${spouse?.fullName} (${spouse?.id})`);
  }
  process.exit(0);
}

checkAliceSpouse();
