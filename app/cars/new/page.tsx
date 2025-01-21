import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CarListingForm } from "@/components/cars/car-form";

export default async function NewCarPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">List Your Car</h1>
      <CarListingForm />
    </div>
  );
} 