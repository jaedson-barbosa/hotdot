"use server";

import { auth } from "@/auth";
import { dbReadPrint } from "@/drizzle";

export async function fetchPrint(id: string) {
  const session = await auth();
  const doc = await dbReadPrint(id)
  
}
