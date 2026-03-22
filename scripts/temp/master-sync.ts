
import { db } from "./src/lib/db";
import { familyMembers, relationships } from "./src/lib/db/schema";
import { eq, and, or } from "drizzle-orm";

async function masterSync() {
  const familyId = "d58ee024-fcac-4925-b827-462726f953a8";
  
  const elderSuhimId = "b93fcc0a-bbcb-4add-ba88-a576d04eb780"; 
  const youngerSuhimId = "0323a849-1ce1-4583-9d43-ef7eecd75c3b"; 
  const rohaniId = "a0c5310b-e0c0-4be2-b599-5b56e2b570a6"; 
  const sulijatiId = "376bb596-dd96-4049-90a9-cc0ee2c6fa7e"; 
  const aliceId = "db3fd762-c516-4914-9813-179574d245e2";

  const children = [sulijatiId, aliceId];
  const parents = [elderSuhimId, rohaniId];

  console.log("--- Master Sync Starting ---");

  // 1. Cleanup incorrect links to Younger Suhim
  console.log("Cleaning up incorrect links to Younger Suhim...");
  await db.delete(relationships).where(
    and(
      eq(relationships.familyId, familyId),
      or(
        and(eq(relationships.fromMemberId, youngerSuhimId), or(eq(relationships.toMemberId, sulijatiId), eq(relationships.toMemberId, aliceId))),
        and(or(eq(relationships.fromMemberId, sulijatiId), eq(relationships.fromMemberId, aliceId)), eq(relationships.toMemberId, youngerSuhimId))
      )
    )
  );

  // 2. Sync bidirectional links for each child and parent pair
  for (const childId of children) {
    for (const parentId of parents) {
      console.log(`Syncing relationships between Parent ${parentId} and Child ${childId}...`);
      
      // Ensure Parent relationship
      const parentRel = await db.select().from(relationships).where(
        and(
          eq(relationships.fromMemberId, parentId),
          eq(relationships.toMemberId, childId),
          eq(relationships.relationType, 'parent')
        )
      );
      if (parentRel.length === 0) {
        await db.insert(relationships).values({ familyId, fromMemberId: parentId, toMemberId: childId, relationType: 'parent' });
      }

      // Ensure Child relationship
      const childRel = await db.select().from(relationships).where(
        and(
          eq(relationships.fromMemberId, childId),
          eq(relationships.toMemberId, parentId),
          eq(relationships.relationType, 'child')
        )
      );
      if (childRel.length === 0) {
        await db.insert(relationships).values({ familyId, fromMemberId: childId, toMemberId: parentId, relationType: 'child' });
      }
    }
  }

  console.log("--- Master Sync Completed ---");
  process.exit(0);
}

masterSync().catch(err => {
  console.error(err);
  process.exit(1);
});
