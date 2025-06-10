import { db } from "@/drizzle";

export async function getPrint(id: string) {
  const doc = await db.query.prints.findFirst({
    where: (prints, { eq }) => eq(prints.id, id),
    with: { sections: { with: { text: true } } },
  });
  return doc;
}
