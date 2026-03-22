
import { db } from "./src/lib/db";
import { familyMembers, relationships } from "./src/lib/db/schema";
import { eq, or } from "drizzle-orm";

async function checkRohani() {
  const rohaniId = "a0c5310b-e0c0-4be2-b599-5b56e2b570a6";
  const m = await db.select().from(familyMembers).where(eq(familyMembers.id, rohaniId));
  console.log("--- ROHANI ---");
  console.log(JSON.stringify(m[0], null, 2));

  console.log("\n--- ROHANI RELATIONSHIPS ---");
  const rels = await db.select().from(relationships).where(or(eq(relationships.fromMemberId, rohaniId), eq(relationships.toMemberId, rohaniId)));
  rels.forEach(r => console.log(`${r.fromMemberId} --[${r.relationType}]--> ${r.toMemberId}`));

  process.exit(0);
}

checkRohani();
