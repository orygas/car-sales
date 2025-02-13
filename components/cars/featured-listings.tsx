"use client"

import { CardHeader, CardTitle } from "@/components/ui/card"
import { CarCard } from "@/components/cars/car-card"
import type { Car } from "@/lib/types"
import { useState } from "react"

interface FeaturedListingsProps {
  listings: Car[]
  initialFavorites: Set<string>
}

export function FeaturedListings({ listings, initialFavorites }: FeaturedListingsProps) {
  const [favorites, setFavorites] = useState(initialFavorites)

  const handleFavoriteChange = (carId: string, isFavorited: boolean) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (isFavorited) {
        next.add(carId)
      } else {
        next.delete(carId)
      }
      return next
    })
  }

  return (
    <div>
      <CardHeader className="px-0">
        <CardTitle className="text-2xl">Featured Listings</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <CarCard 
            key={listing.id} 
            car={listing} 
            featured={true}
            isFavorited={favorites.has(listing.id)}
            onFavoriteChange={handleFavoriteChange}
          />
        ))}
      </div>
    </div>
  )
} 