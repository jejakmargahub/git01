import { execSync } from "child_process";

// We assume this script is run with: npx tsx --env-file=.env.local scripts/migrate-db.ts
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not found. Please run with --env-file=.env.local");
  process.exit(1);
}

try {
  console.log("Pushing schema to database...");
  // Pass current env to the subprocess
  execSync("npx drizzle-kit push", { 
    stdio: "inherit",
    env: process.env 
  });
  console.log("Database schema synchronized successfully!");
} catch (error) {
  console.error("Failed to push schema.");
  process.exit(1);
}
