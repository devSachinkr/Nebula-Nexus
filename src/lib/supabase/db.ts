import { drizzle } from "drizzle-orm/postgres-js";

import postgres from "postgres";
import * as dotenv from "dotenv";

import * as schema from "../../../migrations/schema";
import { migrate } from "drizzle-orm/postgres-js/migrator";

dotenv.config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const client = postgres(process.env.DATABASE_URL, { max: 1 });

const db = drizzle(client, { schema });

const migrateDb = async () => {
  try {
    await migrate(db, { migrationsFolder: "migrations" });
    console.log("Database migrated 😊");
  } catch (error) {
    console.log("❌",error);
  }
};
 migrateDb();
export default db;
