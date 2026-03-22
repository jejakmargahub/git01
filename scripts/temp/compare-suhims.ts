
import { db } from "./src/lib/db";
import { familyMembers } from "./src/lib/db/schema";
import { eq, or } from "drizzle-orm";

async function compare() {
  const id1 = "0323a849-1ce1-4583-9d43-ef7eecd75c3b"; // Herry Suhim
  const id2 = "b93fcc0a-bbcb-4add-ba88-a576d04eb780"; // Suhim
  
  const m1 = await db.select().from(familyMembers).where(eq(familyMembers.id, id1));
  const m2 = await db.select().from(familyMembers).where(eq(familyMembers.id, id2));

  console.log("--- MEMBER 1 (Herry Suhim) ---");
  console.log(JSON.stringify(m1[0], null, 2));

  console.log("\n--- MEMBER 2 (Suhim) ---");
  console.log(JSON.stringify(m2[0], null, 2));

  process.exit(0);
}

compare();
