"use client"

import { Car } from "@/lib/types"
import { CarCard } from "./car-card"
import { cn } from "@/lib/utils"

interface CarGridProps {
  listings: Car[]
  view: "grid" | "list"
  favoritedCarIds: string[]
}

export function CarGrid({ listings, view, favoritedCarIds }: CarGridProps) {
  return (
    <div className={cn(
      view === "grid"
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        : "space-y-4"
    )}>
      {listings.map((listing) => (
        <CarCard
          key={listing.id}
          car={listing}
          listMode={view === "list"}
          isFavorited={favoritedCarIds.includes(listing.id)}
        />
      ))}
    </div>
  )
} 