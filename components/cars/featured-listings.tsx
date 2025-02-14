"use client"

import { CardHeader, CardTitle } from "@/components/ui/card"
import { CarCard } from "@/components/cars/car-card"
import type { Car } from "@/lib/types"

interface FeaturedListingsProps {
  listings: Car[]
}

export function FeaturedListings({ listings }: FeaturedListingsProps) {
  return (
    <div>
      <CardHeader className="px-0">
        <CardTitle className="text-2xl">Featured Listings</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.slice(0, 3).map((listing) => (
          <CarCard 
            key={listing.id} 
            car={listing} 
            featured={true}
          />
        ))}
      </div>
    </div>
  )
} 