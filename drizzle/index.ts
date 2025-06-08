import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

export const db = drizzle({
  connection: process.env.DATABASE_URL,
  casing: "snake_case",
  schema,
});

export async function dbCreatePrint(authorId: string | undefined) {
  const [{ id }] = await db
    .insert(schema.prints)
    .values({ authorId })
    .returning();
  return id;
}

export async function dbReadPrint(id: string) {
  const doc = await db.query.prints.findFirst({
    where: (prints, { eq }) => eq(prints.id, id),
    with: { sections: { with: { text: true } } },
  });
  return doc;
}
