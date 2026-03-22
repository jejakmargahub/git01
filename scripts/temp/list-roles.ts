
import fs from "fs";
const env = fs.readFileSync(".env.local", "utf8");
const dbUrl = env.split("\n").find(line => line.startsWith("DATABASE_URL="))?.split("=")[1]?.replace(/"/g, "").trim();
process.env.DATABASE_URL = dbUrl;

import { db } from "./src/lib/db";
import { users, familyAccess } from "./src/lib/db/schema";
import { sql } from "drizzle-orm";

async function listRoles() {
  const userRoles = await db.selectDistinct({ role: users.role }).from(users);
  const accessRoles = await db.selectDistinct({ role: familyAccess.role }).from(familyAccess);
  
  console.log("--- ROLES IN USERS TABLE ---");
  userRoles.forEach(r => console.log(`- ${r.role}`));
  
  console.log("\n--- ROLES IN FAMILY_ACCESS TABLE ---");
  accessRoles.forEach(r => console.log(`- ${r.role}`));
  
  process.exit(0);
}

listRoles().catch(err => {
  console.error(err);
  process.exit(1);
});
