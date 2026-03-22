
import { db } from "./src/lib/db";
import { families, familyMembers, relationships } from "./src/lib/db/schema";
import { eq, or, ilike } from "drizzle-orm";

async function findDuplicates() {
  const familyId = "d58ee024-fcac-4925-b827-462726f953a8";
  const members = await db.select().from(familyMembers).where(eq(familyMembers.familyId, familyId));
  
  console.log("--- SUSPECTED DUPLICATES (SUHIM) ---");
  const suhims = members.filter(m => m.fullName.toLowerCase().includes("suhim") || m.fullName.toLowerCase().includes("ahim"));
  suhims.forEach(m => console.log(`${m.id}: ${m.fullName}`));

  console.log("\n--- SUSPECTED DUPLICATES (ROHANI) ---");
  const rohanis = members.filter(m => m.fullName.toLowerCase().includes("rohani"));
  rohanis.forEach(m => console.log(`${m.id}: ${m.fullName}`));

  process.exit(0);
}

findDuplicates();
