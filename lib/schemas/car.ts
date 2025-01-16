import { z } from "zod"

export const carSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number()
    .min(1900, "Year must be 1900 or later")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  price: z.number()
    .min(0, "Price must be greater than 0")
    .max(10000000, "Price must be less than 10,000,000"),
  mileage: z.number()
    .min(0, "Mileage must be greater than 0")
    .max(1000000, "Mileage must be less than 1,000,000"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  condition: z.enum(["New", "Like New", "Excellent", "Good", "Fair", "Poor"]),
  transmission: z.enum(["Automatic", "Manual"]),
  fuelType: z.enum(["Gasoline", "Diesel", "Electric", "Hybrid"]),
  location: z.string().min(1, "Location is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
})

export type CarListing = z.infer<typeof carSchema> 