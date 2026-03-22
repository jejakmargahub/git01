
import { db } from "./src/lib/db";
import { families, familyMembers, relationships } from "./src/lib/db/schema";
import { eq, and } from "drizzle-orm";

async function fixData() {
  const familyId = "d58ee024-fcac-4925-b827-462726f953a8";
  
  const members = await db.select().from(familyMembers).where(eq(familyMembers.familyId, familyId));
  const rels = await db.select().from(relationships).where(eq(relationships.familyId, familyId));

  const suhim = members.find(m => m.fullName.includes("Suhim"));
  const rohani = members.find(m => m.fullName.includes("Rohani"));

  if (!suhim || !rohani) {
    console.log("Suhim or Rohani not found");
    process.exit(1);
  }

  console.log(`Father: ${suhim.fullName} (${suhim.id})`);
  console.log(`Mother: ${rohani.fullName} (${rohani.id})`);

  // Find all children of Suhim
  const childrenOfSuhim = rels.filter(r => r.fromMemberId === suhim.id && r.relationType === 'parent');
  
  for (const c of childrenOfSuhim) {
    const childId = c.toMemberId;
    const childMember = members.find(m => m.id === childId);
    
    // Check if Rohani is already a parent
    const exists = rels.some(r => r.fromMemberId === rohani.id && r.toMemberId === childId && r.relationType === 'parent');
    
    if (!exists) {
      console.log(`Adding Rohani as parent for ${childMember?.fullName} (${childId})...`);
      await db.insert(relationships).values({
        familyId: familyId,
        fromMemberId: rohani.id,
        toMemberId: childId,
        relationType: 'parent'
      });
      console.log("Done.");
    } else {
      console.log(`${rohani.fullName} is already linked as parent for ${childMember?.fullName}.`);
    }
  }

  process.exit(0);
}

fixData();
