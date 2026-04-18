import { db } from "../src/lib/db";
import { users } from "../src/lib/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Email required");
    return;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (user) {
    console.log("USER_ID_START:" + user.id + ":USER_ID_END");
  } else {
    console.log("User not found");
  }
}

main();
