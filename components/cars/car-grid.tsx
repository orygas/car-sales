"use client"

import { Car } from "@/lib/types"
import { CarCard } from "./car-card"
import { cn } from "@/lib/utils"

interface CarGridProps {
  listings: Car[]
  view: "grid" | "list"
}

export function CarGrid({ listings, view }: CarGridProps) {
  return (
    <div className={cn(
      view === "grid"
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        : "flex flex-col gap-6"
    )}>
      {listings.map((listing) => (
        <CarCard
          key={listing.id}
          car={listing}
          listMode={view === "list"}
        />
      ))}
    </div>
  )
} 