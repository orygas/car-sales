"use client"

import { useState, useEffect } from "react"
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CarCard } from "@/components/cars/car-card"
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel"
import type { Car } from "@/lib/types"

interface LatestListingsProps {
  listings: Car[]
}

export function LatestListings({ listings }: LatestListingsProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const displayListings = listings.slice(0, 3)

  return (
    <div>
      <CardHeader className="px-0">
        <CardTitle className="text-2xl">Newest Listings</CardTitle>
        <CardDescription>
Catch them while they&apos;re hot!        </CardDescription>
      </CardHeader>
      
      {isMobile ? (
        <Carousel className="w-full">
          <CarouselContent>
            {displayListings.map((listing) => (
              <CarouselItem key={listing.id} className="md:basis-1/1 lg:basis-1/1">
                <CarCard car={listing} featured={true} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-2 mt-4">
            <CarouselPrevious className="static translate-y-0 h-8 w-8" />
            <CarouselNext className="static translate-y-0 h-8 w-8" />
          </div>
        </Carousel>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayListings.map((listing) => (
            <CarCard key={listing.id} car={listing} featured={true} />
          ))}
        </div>
      )}
    </div>
  )
} 