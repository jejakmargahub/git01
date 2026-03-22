
import { db } from "./src/lib/db";
import { families, familyMembers, relationships } from "./src/lib/db/schema";
import { eq } from "drizzle-orm";

async function diagnose() {
  const familyId = "d58ee024-fcac-4925-b827-462726f953a8";
  
  const members = await db.select().from(familyMembers).where(eq(familyMembers.familyId, familyId));
  const rels = await db.select().from(relationships).where(eq(relationships.familyId, familyId));

  const suhim = members.find(m => m.fullName.includes("Suhim"));
  const rohani = members.find(m => m.fullName.includes("Rohani"));

  if (suhim && rohani) {
    console.log(`\n--- Suhim (${suhim.id}) Children ---`);
    const childrenOfSuhim = rels.filter(r => r.fromMemberId === suhim.id && r.relationType === 'parent');
    
    childrenOfSuhim.forEach(c => {
       const childMember = members.find(m => m.id === c.toMemberId);
       const hasMother = rels.some(r => r.fromMemberId === rohani.id && r.toMemberId === c.toMemberId && r.relationType === 'parent');
       console.log(` - Child: ${childMember?.fullName} (${c.toMemberId}) | Has Mother Link? ${hasMother ? "YES" : "NO"}`);
    });
  }

  process.exit(0);
}

diagnose();
