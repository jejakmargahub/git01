
import fs from "fs";
const env = fs.readFileSync(".env.local", "utf8");
const dbUrl = env.split("\n").find(line => line.startsWith("DATABASE_URL="))?.split("=")[1]?.replace(/"/g, "").trim();
process.env.DATABASE_URL = dbUrl;

import { db } from "./src/lib/db";
import { relationships, familyMembers } from "./src/lib/db/schema";
import { eq, and, or } from "drizzle-orm";

async function checkAliceSpouse() {
  const aliceId = "db3fd762-c516-4914-9813-179574d245e2";
  const familyId = "d58ee024-fcac-4925-b827-462726f953a8";

  console.log(`--- CHECKING ALICE (${aliceId}) ---`);
  
  const rels = await db.select().from(relationships).where(
    and(
      eq(relationships.familyId, familyId),
      or(
        eq(relationships.fromMemberId, aliceId),
        eq(relationships.toMemberId, aliceId)
      )
    )
  );
  
  console.log(`--- ALL ALICE RELATIONS (${rels.length}) ---`);
  for (const r of rels) {
    const otherId = r.fromMemberId === aliceId ? r.toMemberId : r.fromMemberId;
    const [other] = await db.select().from(familyMembers).where(eq(familyMembers.id, otherId));
    console.log(`- ${r.relationType}: ${other?.fullName} (${otherId})`);
  }
  
  process.exit(0);
}

checkAliceSpouse().catch(err => {
  console.error(err);
  process.exit(1);
});
