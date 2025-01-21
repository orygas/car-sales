"use client"

import { useState, useEffect } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { ImageDialog } from "@/components/cars/image-dialog"

interface CarouselWrapperProps {
  images: string[]
  make: string
  model: string
  price: number
}

export function CarouselWrapper({ 
  images, 
  make, 
  model, 
  price 
}: CarouselWrapperProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [api, setApi] = useState<CarouselApi>()

  useEffect(() => {
    if (!api) {
      return
    }

    api.on("select", () => {
      setCurrentIndex(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <Carousel className="w-full" setApi={setApi}>
      <CarouselContent>
        {images.map((imageUrl: string, index: number) => (
          <CarouselItem key={imageUrl} className="relative">
            <ImageDialog 
              image={imageUrl} 
              images={images} 
              initialIndex={index} 
              make={make} 
              model={model}
              price={price}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute bottom-4 right-4 z-10 bg-black/60 text-white px-3 py-1 rounded-md text-sm">
        {currentIndex + 1}/{images.length}
      </div>
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
    </Carousel>
  )
} 