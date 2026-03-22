
import fs from "fs";
const env = fs.readFileSync(".env.local", "utf8");
const dbUrl = env.split("\n").find(line => line.startsWith("DATABASE_URL="))?.split("=")[1]?.replace(/"/g, "").trim();
process.env.DATABASE_URL = dbUrl;

import { db } from "./src/lib/db";
import { familyMembers, relationships } from "./src/lib/db/schema";
import { eq, and, or, ilike } from "drizzle-orm";

async function findElwinAndHerry() {
  const familyId = "d58ee024-fcac-4925-b827-462726f953a8";
  
  console.log("--- SEARCHING FOR ELWIN & HERRY ---");
  const members = await db.select().from(familyMembers).where(
    and(
      eq(familyMembers.familyId, familyId),
      or(
        ilike(familyMembers.fullName, "%Elwin%"),
        ilike(familyMembers.fullName, "%Herry Suhim%")
      )
    )
  );
  
  for (const m of members) {
    console.log(`\nFound: ${m.fullName} (${m.id})`);
    const rels = await db.select().from(relationships).where(
      and(
        eq(relationships.familyId, familyId),
        or(
          eq(relationships.fromMemberId, m.id),
          eq(relationships.toMemberId, m.id)
        )
      )
    );
    console.log(`Relations (${rels.length}):`);
    for (const r of rels) {
      const otherId = r.fromMemberId === m.id ? r.toMemberId : r.fromMemberId;
      const [other] = await db.select().from(familyMembers).where(eq(familyMembers.id, otherId));
      console.log(`- ${r.relationType}: ${other?.fullName} (${otherId})`);
    }
  }
  
  process.exit(0);
}

findElwinAndHerry().catch(err => {
  console.error(err);
  process.exit(1);
});
