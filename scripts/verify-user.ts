import { db } from "../src/lib/db";
import { users } from "../src/lib/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const email = "christian.kontak@gmail.com";
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (user) {
    console.log("USER_FOUND:" + JSON.stringify(user));
  } else {
    console.log("USER_NOT_FOUND");
  }
}

main().catch(console.error);
