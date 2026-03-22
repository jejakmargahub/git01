
import { db } from "./src/lib/db";
import { families, familyMembers, relationships } from "./src/lib/db/schema";
import { eq, or, and } from "drizzle-orm";

async function diagnose() {
  const familyId = "d58ee024-fcac-4925-b827-462726f953a8";
  
  const members = await db.select().from(familyMembers).where(eq(familyMembers.familyId, familyId));
  const rels = await db.select().from(relationships).where(eq(relationships.familyId, familyId));

  const sulijati = members.find(m => m.fullName.toLowerCase().includes("sulijati"));
  if (!sulijati) {
    console.log("Sulijati not found");
    process.exit(0);
  }

  console.log(`\n--- SULIJATI (${sulijati.id}) ---`);
  
  const parents = rels.filter(r => r.toMemberId === sulijati.id && r.relationType === 'parent');
  console.log(`Parents found in DB: ${parents.length}`);
  parents.forEach(p => {
    const parentMember = members.find(m => m.id === p.fromMemberId);
    console.log(` - ${parentMember?.fullName} (${p.fromMemberId})`);
  });

  if (parents.length > 0) {
    const parentId = parents[0].fromMemberId;
    const parentMember = members.find(m => m.id === parentId);
    console.log(`\n--- Spouses of ${parentMember?.fullName} (${parentId}) ---`);
    const spouses = rels.filter(r => (r.fromMemberId === parentId || r.toMemberId === parentId) && r.relationType === 'spouse');
    spouses.forEach(s => {
      const otherId = s.fromMemberId === parentId ? s.toMemberId : s.fromMemberId;
      const otherMember = members.find(m => m.id === otherId);
      console.log(` - Spouse: ${otherMember?.fullName} (${otherId})`);
      
      // Check if this spouse is also a parent of Sulijati
      const isParent = rels.some(r => r.fromMemberId === otherId && r.toMemberId === sulijati.id && r.relationType === 'parent');
      console.log(`   Is this spouse linked as a parent to Sulijati? ${isParent ? "YES" : "NO"}`);
    });
  }

  process.exit(0);
}

diagnose();
