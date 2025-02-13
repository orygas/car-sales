import { z } from "zod"

export const carSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().min(1900, "Year must be after 1900").max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  price: z.number().min(1, "Price must be greater than 0"),
  mileage: z.number().min(1, "Mileage must be greater than 0"),
  description: z.string().min(50, "Description must be at least 50 characters").max(6000, "Description cannot be longer than 6000 characters"),
  condition: z.enum(["new", "used", "parts"]),
  transmission: z.enum(["manual", "automatic"]),
  fuel_type: z.enum(["gasoline", "diesel", "electric", "hybrid", "lpg", "other"]),
  location: z.string().min(1, "Location is required"),
  has_vin: z.boolean().default(false),
  vin: z.string()
    .transform(val => val || null)
    .pipe(
      z.string()
        .length(17, "VIN must be exactly 17 characters")
        .optional()
        .nullable()
    ),
  images: z.array(z.string()).min(1, "At least one image is required"),
  is_damaged: z.boolean(),
  is_imported: z.boolean(),
  import_country: z.string().optional(),
  is_first_owner: z.boolean().optional(),
  is_accident_free: z.boolean().optional(),
  is_registered: z.boolean().optional(),
  is_serviced_at_dealer: z.boolean().optional(),
  has_tuning: z.boolean().optional(),
  registration_number: z.string().optional().transform(val => val || ""),
  first_registration_date: z.string().optional().transform(val => val || ""),
  show_registration_info: z.boolean(),
  seller_name: z.string().min(1, "Seller name is required"),
  seller_phone: z.string().min(1, "Phone number is required"),
}).superRefine((data, ctx) => {
  if (data.is_registered) {
    if (!data.registration_number) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Registration number is required when the car is registered",
        path: ["registration_number"]
      });
    }
    if (!data.first_registration_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "First registration date is required when the car is registered",
        path: ["first_registration_date"]
      });
    } else {
      const registrationYear = new Date(data.first_registration_date).getFullYear()
      if (registrationYear < data.year) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "First registration date cannot be earlier than the car's make year",
          path: ["first_registration_date"]
        });
      }
    }
  }

  if (data.is_imported && !data.import_country) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Import country is required when the car is imported",
      path: ["import_country"]
    });
  }
});

export type CarListing = z.infer<typeof carSchema>

export const carSteps = [
  {
    id: "vehicle",
    title: "Vehicle Details",
    description: "Basic information about your vehicle",
    fields: ["make", "model", "year", "has_vin", "vin"],
  },
  {
    id: "condition",
    title: "Condition & Specs",
    description: "Vehicle condition and specifications",
    fields: [
      "condition", 
      "transmission", 
      "fuel_type", 
      "mileage",
      "is_damaged",
      "is_imported",
      "import_country",
    ],
  },
  {
    id: "additional",
    title: "Additional Information",
    description: "More details about your vehicle",
    fields: [
      "is_first_owner",
      "is_accident_free",
      "is_registered",
      "is_serviced_at_dealer",
      "has_tuning",
      "registration_number",
      "first_registration_date",
      "show_registration_info",
    ],
  },
  {
    id: "listing",
    title: "Listing Details",
    description: "Information about the listing",
    fields: ["price", "location", "description"],
  },
  {
    id: "seller",
    title: "Seller Information",
    description: "Your contact information",
    fields: ["seller_name", "seller_phone"],
  },
  {
    id: "images",
    title: "Images",
    description: "Upload images of your vehicle",
    fields: ["images"],
  },
] as const

export type CarStep = typeof carSteps[number] 