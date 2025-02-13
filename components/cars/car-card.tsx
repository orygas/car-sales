"use client"

import { Car } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { Fuel, Calendar, Gauge } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface CarCardProps {
  car: Car
  featured?: boolean
  listMode?: boolean
}

/**
 * CarCard component - A reusable card component for displaying car listings
 * Can be used in both grid and list views, and for featured listings
 */
export function CarCard({ car, featured, listMode }: CarCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={`/cars/${car.id}`}>
      <Card 
        className={cn(
          "group h-full transition-shadow hover:shadow-lg",
          listMode ? "grid grid-cols-[300px_1fr] overflow-hidden" : ""
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className={cn(
          "p-0",
          listMode ? "contents" : ""
        )}>
          {/* Image container */}
          <div className={cn(
            "relative overflow-hidden",
            listMode ? "h-full" : "aspect-[4/3] rounded-t-lg"
          )}>
            <Image
              src={car.images[0]}
              alt={`${car.make} ${car.model}`}
              fill
              className={cn(
                "object-cover transition-transform duration-300",
                isHovered ? "scale-105" : ""
              )}
            />
            {featured && (
              <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 text-xs font-medium rounded">
                Featured
              </div>
            )}
          </div>

          {/* Content */}
          <div className={cn(
            "flex flex-col",
            listMode ? "p-6" : "p-4"
          )}>
            {/* Title and price */}
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold truncate">
                  {car.make.toUpperCase()} {car.model.toUpperCase()}
                </h3>
                <p className="text-sm text-muted-foreground">{car.location}</p>
              </div>
              <p className="font-bold whitespace-nowrap">
                {formatPrice(car.price)} zł
              </p>
            </div>

            {/* Additional details */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>{car.year}</span>
              </div>
              <div className="flex items-center gap-1">
                <Gauge className="h-4 w-4 flex-shrink-0" />
                <span>{car.mileage.toLocaleString()} km</span>
              </div>
              <div className="flex items-center gap-1">
                <Fuel className="h-4 w-4 flex-shrink-0" />
                <span className="capitalize">{car.fuel_type}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
} 