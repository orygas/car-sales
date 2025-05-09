import type { Metadata } from "next"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { CarListingForm } from "@/components/cars/car-form"

export const metadata: Metadata = {
  title: "Create Listing",
  description: "List your car for sale. Add photos, details, and set your price to reach potential buyers.",
  openGraph: {
    title: "Create Listing | Auto Market",
    description: "List your car for sale. Add photos, details, and set your price to reach potential buyers.",
  }
}

export default async function NewCarPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <div className="container py-6">
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold">Create Listing</h1>
        <p className="text-xl text-muted-foreground">
          List your car for sale on Auto Market
        </p>
      </div>
      <CarListingForm />
    </div>
  )
}