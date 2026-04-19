import { db } from "../src/lib/db";
import { familyAccess } from "../src/lib/db/schema";

async function main() {
  const userId = "45d37a3b-1a2a-455d-ab4b-08886d89acec";
  const familyId = "f0d43560-4d74-437d-9a2a-4083ef2a6c8f";

  console.log("Adding admin access for user...");
  await db.insert(familyAccess).values({
    familyId: familyId,
    userId: userId,
    role: "admin",
  });

  console.log("Access granted successfully!");
}

main().catch(console.error);
