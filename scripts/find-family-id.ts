import { db } from "../src/lib/db";
import { families } from "../src/lib/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const familyName = "Silsilah Para Patriark Keturunan Guru";

  const family = await db.query.families.findFirst({
    where: eq(families.name, familyName),
  });

  if (family) {
    console.log("FAMILY_ID_START:" + family.id + ":FAMILY_ID_END");
  } else {
    console.log("Family not found");
  }
}

main();
