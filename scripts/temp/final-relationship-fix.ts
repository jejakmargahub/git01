
import { db } from "./src/lib/db";
import { familyMembers, relationships } from "./src/lib/db/schema";
import { eq, and } from "drizzle-orm";

async function runFix() {
  const familyId = "d58ee024-fcac-4925-b827-462726f953a8";
  
  // Data points
  const elderSuhimId = "b93fcc0a-bbcb-4add-ba88-a576d04eb780"; // Born 1938, Nickname Ahim
  const youngerSuhimId = "0323a849-1ce1-4583-9d43-ef7eecd75c3b"; // Born 1979, Nickname Aming
  const rohaniId = "a0c5310b-e0c0-4be2-b599-5b56e2b570a6"; // Born 1936, Nickname Apho
  const sulijatiId = "376bb596-dd96-4049-90a9-cc0ee2c6fa7e"; // Born 1957
  const aliceId = "db3fd762-c516-4914-9813-179574d245e2";

  console.log("--- Starting Relationship Fix ---");

  // 1. Link Rohani to Sulijati
  const sulijatiMotherExists = await db.select().from(relationships).where(
    and(
      eq(relationships.fromMemberId, rohaniId),
      eq(relationships.toMemberId, sulijatiId),
      eq(relationships.relationType, 'parent')
    )
  );
  if (sulijatiMotherExists.length === 0) {
    console.log("Linking Rohani as mother to Sulijati...");
    await db.insert(relationships).values({
      familyId,
      fromMemberId: rohaniId,
      toMemberId: sulijatiId,
      relationType: 'parent'
    });
  } else {
    console.log("Rohani already linked to Sulijati.");
  }

  // 2. Fix Alice's Father (Move from Younger to Elder Suhim)
  const aliceFatherWrong = await db.select().from(relationships).where(
    and(
      eq(relationships.fromMemberId, youngerSuhimId),
      eq(relationships.toMemberId, aliceId),
      eq(relationships.relationType, 'parent')
    )
  );
  if (aliceFatherWrong.length > 0) {
    console.log("Moving Alice's father from Younger Suhim to Elder Suhim...");
    for (const rel of aliceFatherWrong) {
        // We delete the old one and add new one
        await db.delete(relationships).where(eq(relationships.id, rel.id));
    }
    await db.insert(relationships).values({
      familyId,
      fromMemberId: elderSuhimId,
      toMemberId: aliceId,
      relationType: 'parent'
    });
  } else {
    console.log("Alice's father might already be correct or missing.");
  }

  // 3. Ensure Alice has Rohani as mother (My previous script might have added it already)
  const aliceMotherExists = await db.select().from(relationships).where(
    and(
      eq(relationships.fromMemberId, rohaniId),
      eq(relationships.toMemberId, aliceId),
      eq(relationships.relationType, 'parent')
    )
  );
  if (aliceMotherExists.length === 0) {
    console.log("Linking Rohani as mother to Alice...");
    await db.insert(relationships).values({
      familyId,
      fromMemberId: rohaniId,
      toMemberId: aliceId,
      relationType: 'parent'
    });
  } else {
    console.log("Rohani already linked to Alice.");
  }

  console.log("--- Fix Completed ---");
  process.exit(0);
}

runFix().catch(err => {
  console.error(err);
  process.exit(1);
});
