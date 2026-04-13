"use server";

import { db } from "@/lib/db";
import { ethnicities } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

/**
 * Mengambil semua daftar etnis dari database.
 * Digunakan untuk mengisi dropdown pada MemberForm.
 */
export async function getEthnicities() {
  try {
    const data = await db
      .select()
      .from(ethnicities)
      .orderBy(asc(ethnicities.name));
    
    return data;
  } catch (error) {
    console.error("Gagal mengambil data etnis dari database:", error);
    return [];
  }
}
