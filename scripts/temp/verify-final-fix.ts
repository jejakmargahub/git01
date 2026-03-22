
import { db } from "./src/lib/db";
import { familyMembers, relationships } from "./src/lib/db/schema";
import { eq, and } from "drizzle-orm";

async function verify() {
  const familyId = "d58ee024-fcac-4925-b827-462726f953a8";
  const members = await db.select().from(familyMembers).where(eq(familyMembers.familyId, familyId));
  const rels = await db.select().from(relationships).where(eq(relationships.familyId, familyId));

  const elderSuhimId = "b93fcc0a-bbcb-4add-ba88-a576d04eb780"; 
  const rohaniId = "a0c5310b-e0c0-4be2-b599-5b56e2b570a6"; 
  const sulijatiId = "376bb596-dd96-4049-90a9-cc0ee2c6fa7e"; 
  const aliceId = "db3fd762-c516-4914-9813-179574d245e2";

  console.log("--- FINAL VERIFICATION ---");
  
  [sulijatiId, aliceId].forEach(childId => {
    const childName = members.find(m => m.id === childId)?.fullName;
    const parents = rels.filter(r => r.toMemberId === childId && r.relationType === 'parent');
    console.log(`Child: ${childName} (${childId})`);
    parents.forEach(p => {
      const parentName = members.find(m => m.id === p.fromMemberId)?.fullName;
      console.log(` - Parent: ${parentName} (${p.fromMemberId})`);
    });
  });

  process.exit(0);
}

verify();
