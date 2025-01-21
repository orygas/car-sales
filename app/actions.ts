'use server'

import { uploadImage } from "@/lib/server-utils"

export async function uploadCarImage(file: File) {
  try {
    const url = await uploadImage(file)
    return { url }
  } catch (error) {
    console.error('Error uploading car image:', error)
    return { error: 'Failed to upload image' }
  }
} 