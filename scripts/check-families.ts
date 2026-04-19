import { db } from "../src/lib/db";
import { families } from "../src/lib/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const userId = "45d37a3b-1a2a-455d-ab4b-08886d89acec";
  const results = await db.query.families.findMany({
    where: eq(families.createdBy, userId),
  });

  console.log("FAMILIES_FOUND:" + JSON.stringify(results));
}

main().catch(console.error);
