
import { db } from "./src/lib/db";
import { relationships } from "./src/lib/db/schema";
import { eq, or } from "drizzle-orm";

async function checkOrphan() {
  const youngerSuhimId = "0323a849-1ce1-4583-9d43-ef7eecd75c3b";
  const rels = await db.select().from(relationships).where(
    or(
      eq(relationships.fromMemberId, youngerSuhimId),
      eq(relationships.toMemberId, youngerSuhimId)
    )
  );
  console.log(`--- RELATIONSHIPS FOR YOUNGER SUHIM (${rels.length}) ---`);
  rels.forEach(r => console.log(`${r.fromMemberId} --[${r.relationType}]--> ${r.toMemberId}`));

  process.exit(0);
}

checkOrphan();
