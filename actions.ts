"use server";

import { auth } from "@/auth";
import { db } from "@/drizzle";
import { redirect } from "next/navigation";
import { prints, sections, type TextInsert, texts } from "./drizzle/schema";
import { eq } from "drizzle-orm";

export async function createPrintAndRedirect() {
  const session = await auth();
  const userId = session?.user?.id;
  const [{ printId }] = await db
    .insert(prints)
    .values({ authorId: userId })
    .returning({ printId: prints.id });
  redirect("/" + printId);
}

export async function saveText(formData: FormData) {
  const printId = formData.get("printId") as string;
  const text: TextInsert = {
    align: formData.get("align") as any,
    font: formData.get("font") as any,
    text: formData.get("text") as any,
  };
  if (formData.has("textId")) {
    const textId = +(formData.get("textId") as string);
    await db.update(texts).set(text).where(eq(texts.id, textId)).execute();
  } else {
    const [{ textId }] = await db
      .insert(texts)
      .values(text)
      .returning({ textId: texts.id });
    await db.insert(sections).values({ printId, textId }).execute();
  }
  redirect("/" + printId);
}
