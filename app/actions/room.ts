"use server";
import { client } from "@/lib/sanity/client";
import { revalidatePath } from "next/cache";

export async function manageRoomAction(id: string | null, data: any) {
  try {
    if (id) {
      // UPDATE
      await client.patch(id).set(data).commit();
    } else {
      // CREATE
      const { title, ...rest } = data;
      await client.create({
        _type: 'room',
        title,
        ...rest,
        slug: { 
          _type: 'slug', 
          current: title.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(2, 5) 
        },
      });
    }
    
    revalidatePath("/management/room");
    return { success: true };
  } catch (error: any) {
    console.error("Sanity Error:", error.message);
    return { success: false, error: error.message };
  }
}

export async function deleteRoomAction(id: string) {
  try {
    await client.delete(id);
    revalidatePath("/management/room");
    return { success: true };
  } catch (error: any) {
    console.error("Delete Error:", error);
    return { success: false, error: error.message };
  }
}