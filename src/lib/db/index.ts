import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let dbInstance: any = null;

export const db: any = new Proxy(
  {},
  {
    get: (_, prop) => {
      if (!dbInstance) {
        const url = process.env.DATABASE_URL;
        if (!url) {
          throw new Error("DATABASE_URL is not defined");
        }
        const sql = neon(url);
        dbInstance = drizzle(sql, { schema });
      }
      return dbInstance[prop];
    },
  }
);
