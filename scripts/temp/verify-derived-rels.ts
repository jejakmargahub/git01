
import fs from "fs";
const env = fs.readFileSync(".env.local", "utf8");
const dbUrl = env.split("\n").find(line => line.startsWith("DATABASE_URL="))?.split("=")[1]?.replace(/"/g, "").trim();
process.env.DATABASE_URL = dbUrl;

import { getMemberRelationships } from "./src/lib/actions/relationship";

async function verifyDerivedRels() {
  const familyId = "d58ee024-fcac-4925-b827-462726f953a8";
  
  // 1. Verify Sulijati sees Elwin (Athu's child)
  const sulijatiId = "376bb596-dd96-4049-90a9-cc0ee2c6fa7e";
  console.log("--- SULIJATI RELATIONS ---");
  const sulRels = await getMemberRelationships(familyId, sulijatiId);
  sulRels.forEach(r => {
    console.log(`- ${r.relationType}: ${r.relatedMember.fullName}`);
  });

  // 2. Verify Elwin sees Sulijati (Athu's spouse)
  const elwinId = "05960160-0823-4457-ad32-b8d4ce36758a";
  console.log("\n--- ELWIN RELATIONS ---");
  const elwinRels = await getMemberRelationships(familyId, elwinId);
  elwinRels.forEach(r => {
    console.log(`- ${r.relationType}: ${r.relatedMember.fullName}`);
  });

  // 3. Verify Herry Suhim sees Liu Siw Lan (Suwardi's spouse)
  const herryId = "0323a849-1ce1-4583-9d43-ef7eecd75c3b";
  console.log("\n--- HERRY SUHIM RELATIONS ---");
  const herryRels = await getMemberRelationships(familyId, herryId);
  herryRels.forEach(r => {
    console.log(`- ${r.relationType}: ${r.relatedMember.fullName}`);
  });

  process.exit(0);
}

verifyDerivedRels().catch(err => {
  console.error(err);
  process.exit(1);
});
