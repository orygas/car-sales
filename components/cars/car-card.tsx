"use client"

import { Car } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { Fuel, Calendar, Gauge, Pencil, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface CarCardProps {
  car: Car
  featured?: boolean
  listMode?: boolean
  showActions?: boolean
}

/**
 * CarCard component - A reusable card component for displaying car listings
 * Can be used in both grid and list views, and for featured listings
 */
export function CarCard({ car, featured, listMode, showActions }: CarCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/cars/${car.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete listing')
      }

      toast({
        title: "Success",
        description: "Listing deleted successfully",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete listing",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (showActions) {
      return children
    }
    return (
      <Link href={`/cars/${car.id}`}>
        {children}
      </Link>
    )
  }

  return (
    <CardWrapper>
      <Card 
        className={cn(
          "group h-full transition-all duration-300 hover:shadow-lg relative",
          listMode ? "grid grid-cols-[120px_1fr] sm:grid-cols-[200px_1fr] md:grid-cols-[300px_1fr] overflow-hidden" : ""
        )}
      >
        <CardContent className={cn(
          "p-0",
          listMode ? "contents" : ""
        )}>
          {/* Image container */}
          <div className={cn(
            "relative overflow-hidden",
            listMode 
              ? "h-full w-full" 
              : "aspect-[4/3] rounded-t-lg"
          )}>
            <Image
              src={car.images[0]}
              alt={`${car.make} ${car.model}`}
              fill
              className={cn(
                "object-cover transition-transform duration-300 ease-in-out",
                listMode ? "group-hover:scale-110" : "group-hover:scale-105"
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
            listMode ? "p-3 sm:p-4 md:p-6" : "p-4"
          )}>
            {/* Title and price */}
            <div className="flex items-start justify-between gap-2 sm:gap-4 mb-2">
              <div className="min-w-0 flex-1">
                <h3 className={cn(
                  "font-semibold truncate",
                  listMode ? "text-sm sm:text-base" : "text-base"
                )}>
                  {car.make.toUpperCase()} {car.model.toUpperCase()}
                </h3>
                <p className={cn(
                  "text-muted-foreground truncate",
                  listMode ? "text-xs sm:text-sm" : "text-sm"
                )}>
                  {car.location}
                </p>
              </div>
              <p className={cn(
                "font-bold whitespace-nowrap",
                listMode ? "text-sm sm:text-base" : "text-base"
              )}>
                {formatPrice(car.price)} zł
              </p>
            </div>

            {/* Additional details */}
            <div className={cn(
              "flex flex-wrap items-center",
              listMode ? "text-xs sm:text-sm mt-1" : "text-sm mt-2",
              listMode ? "gap-x-2 gap-y-1 sm:gap-4" : "gap-4"
            )}>
              <div className="flex items-center gap-1 min-w-[70px] sm:min-w-0">
                <Calendar className={cn(
                  "flex-shrink-0",
                  listMode ? "h-3 w-3 sm:h-4 sm:w-4" : "h-4 w-4"
                )} />
                <span>{car.year}</span>
              </div>
              <div className="flex items-center gap-1">
                <Gauge className={cn(
                  "flex-shrink-0",
                  listMode ? "h-3 w-3 sm:h-4 sm:w-4" : "h-4 w-4"
                )} />
                <span>{car.mileage.toLocaleString()} km</span>
              </div>
              <div className="flex items-center gap-1">
                <Fuel className={cn(
                  "flex-shrink-0",
                  listMode ? "h-3 w-3 sm:h-4 sm:w-4" : "h-4 w-4"
                )} />
                <span className="capitalize">{car.fuel_type}</span>
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    toast({
                      title: "Not Implemented",
                      description: "Edit functionality is not available yet",
                      variant: "default",
                    })
                  }}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="flex-1">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your listing.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  )
}