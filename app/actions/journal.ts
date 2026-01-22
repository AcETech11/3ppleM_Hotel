"use server";
import { client } from "@/lib/sanity/client";
import { revalidatePath } from "next/cache";

export async function manageJournalAction(data: any, id?: string) {
  try {
    if (id) {
      await client.patch(id).set(data).commit();
    } else {
      // Auto-generate slug for new articles
      const slug = data.title.toLowerCase().replace(/\s+/g, '-').slice(0, 200);
      await client.create({ 
        _type: 'journal', 
        ...data, 
        slug: { _type: 'slug', current: slug } 
      });
    }
    revalidatePath("/management/journal");
    return { success: true };
  } catch (error: any) {
    console.error("Journal Action Error:", error);
    return { success: false, error: error.message };
  }
}