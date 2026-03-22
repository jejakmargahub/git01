
import { db } from "./src/lib/db";
import { familyMembers } from "./src/lib/db/schema";
import { ilike } from "drizzle-orm";

async function main() {
  const members = await db.select().from(familyMembers).where(ilike(familyMembers.fullName, "%Afang%"));
  console.log(JSON.stringify(members, null, 2));
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
