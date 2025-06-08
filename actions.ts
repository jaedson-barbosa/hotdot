"use server";

import { auth } from "@/auth";
import { dbCreatePrint } from "@/drizzle";
import { redirect } from "next/navigation";

export async function createPrintAndRedirect() {
  const session = await auth();
  const userId = session?.user?.id;
  const id = await dbCreatePrint(userId);
  console.log(id)
  redirect("/" + id);
}
