import { CarListingForm } from "@/components/cars/car-form"

export default function NewCarListingPage() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-10">List Your Car</h1>
      <div className="mx-auto">
        <CarListingForm />
      </div>
    </>
  )
} 