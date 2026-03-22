
import fs from "fs";
const env = fs.readFileSync(".env.local", "utf8");
const dbUrl = env.split("\n").find(line => line.startsWith("DATABASE_URL="))?.split("=")[1]?.replace(/"/g, "").trim();
process.env.DATABASE_URL = dbUrl;

import { db } from "./src/lib/db";
import { familyMembers, relationships } from "./src/lib/db/schema";
import { eq, and, or } from "drizzle-orm";

async function checkSuwardi() {
  const suwardiId = "27fdfd65-9d3c-4153-af8f-f74116440f59";
  const familyId = "d58ee024-fcac-4925-b827-462726f953a8";

  console.log(`--- CHECKING SUWARDI (${suwardiId}) ---`);
  const [m] = await db.select().from(familyMembers).where(eq(familyMembers.id, suwardiId));
  console.log(`FullName: ${m?.fullName}`);
  
  const rels = await db.select().from(relationships).where(
    and(
      eq(relationships.familyId, familyId),
      or(
        eq(relationships.fromMemberId, suwardiId),
        eq(relationships.toMemberId, suwardiId)
      )
    )
  );
  
  console.log(`Relations (${rels.length}):`);
  for (const r of rels) {
    const otherId = r.fromMemberId === suwardiId ? r.toMemberId : r.fromMemberId;
    const [other] = await db.select().from(familyMembers).where(eq(familyMembers.id, otherId));
    console.log(`- ${r.relationType}: ${other?.fullName} (${otherId})`);
  }
  
  process.exit(0);
}

checkSuwardi().catch(err => {
  console.error(err);
  process.exit(1);
});
