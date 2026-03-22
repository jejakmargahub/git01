
import fs from "fs";
const env = fs.readFileSync(".env.local", "utf8");
const dbUrl = env.split("\n").find(line => line.startsWith("DATABASE_URL="))?.split("=")[1]?.replace(/"/g, "").trim();
process.env.DATABASE_URL = dbUrl;

import { db } from "./src/lib/db";
import { relationships, familyMembers } from "./src/lib/db/schema";
import { eq, and, or } from "drizzle-orm";

async function checkSulijatiRels() {
  const sulijatiId = "376bb596-dd96-4049-90a9-cc0ee2c6fa7e";
  const familyId = "d58ee024-fcac-4925-b827-462726f953a8";

  console.log(`--- CHECKING SULIJATI (${sulijatiId}) ---`);
  
  const rels = await db.select().from(relationships).where(
    and(
      eq(relationships.familyId, familyId),
      or(
        eq(relationships.fromMemberId, sulijatiId),
        eq(relationships.toMemberId, sulijatiId)
      )
    )
  );
  
  console.log(`--- ALL SULIJATI RELATIONS (${rels.length}) ---`);
  for (const r of rels) {
    const otherId = r.fromMemberId === sulijatiId ? r.toMemberId : r.fromMemberId;
    const [other] = await db.select().from(familyMembers).where(eq(familyMembers.id, otherId));
    console.log(`- ${r.relationType}: ${other?.fullName} (${otherId})`);
  }
  
  process.exit(0);
}

checkSulijatiRels().catch(err => {
  console.error(err);
  process.exit(1);
});
