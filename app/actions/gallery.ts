"use server";
import { client } from "@/lib/sanity/client";
import { revalidatePath } from "next/cache";

export async function manageGalleryAction(type: 'category' | 'gallery', data: any, id?: string) {
  try {
    if (id) {
      await client.patch(id).set(data).commit();
    } else {
      await client.create({ _type: type, ...data });
    }
    revalidatePath("/management/gallery");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteGalleryItem(id: string) {
  try {
    await client.delete(id);
    revalidatePath("/management/gallery");
    return { success: true };
  } catch (error: any) {
    return { success: false };
  }
}