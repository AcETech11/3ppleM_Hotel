"use server";
import { writeClient } from "@/lib/sanity/client";
import { revalidatePath } from "next/cache";

/**
 * Manages Gallery Documents or Categories
 * For Gallery: Each call creates ONE document with ONE image + Alt + Caption
 */
export async function manageGalleryAction(
  type: 'category' | 'gallery', 
  data: any, 
  id?: string
) {
  try {
    if (id) {
      // Update existing document (e.g., changing a caption or title)
      await writeClient
        .patch(id)
        .set(data)
        .commit();
    } else {
      // Create a new document
      // If type is 'gallery', data should contain { title, category, image: { asset, alt, caption } }
      await writeClient.create({
        _type: type,
        ...data,
      });
    }

    // Clear caches so the management dashboard and public site update immediately
    revalidatePath("/management/gallery");
    revalidatePath("/gallery"); 
    revalidatePath("/"); // Update home page diverse grid
    
    return { success: true };
  } catch (error: any) {
    console.error("Sanity Action Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Deletes a single gallery image or an entire category
 */
export async function deleteGalleryItem(id: string) {
  try {
    await writeClient.delete(id);
    
    revalidatePath("/management/gallery");
    revalidatePath("/gallery");
    
    return { success: true };
  } catch (error: any) {
    console.error("Delete Error:", error);
    return { success: false, error: error.message };
  }
}