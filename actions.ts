"use server";

import { auth } from "@/auth";
import { db, dbCreatePrint } from "@/drizzle";
import { redirect } from "next/navigation";
import { sections, type TextInsert, texts } from "./drizzle/schema";

export async function createPrintAndRedirect() {
  const session = await auth();
  const userId = session?.user?.id;
  const printId = await dbCreatePrint(userId);
  redirect("/" + printId);
}

export async function addText(formData: FormData) {
  const printId = formData.get("printId") as string;
  const text: TextInsert = {
    align: formData.get("align") as any,
    font: formData.get("font") as any,
    text: formData.get("text") as any,
  };
  const [{ textId }] = await db
    .insert(texts)
    .values(text)
    .returning({ textId: texts.id });
  await db.insert(sections).values({ printId, textId }).execute();
  redirect("/" + printId);
}
