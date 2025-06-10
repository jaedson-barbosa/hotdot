import { db } from "@/drizzle";

export async function getText(id: number) {
  const doc = await db.query.texts.findFirst({
    where: (texts, { eq }) => eq(texts.id, id),
  });
  return doc;
}
