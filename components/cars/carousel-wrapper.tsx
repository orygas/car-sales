"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ImageDialog } from "@/components/cars/image-dialog"
import useEmblaCarousel from 'embla-carousel-react'
import Image from "next/image"

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
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', () => {
        setCurrentIndex(emblaApi.selectedScrollSnap())
      })
    }
  }, [emblaApi])

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev()
  const scrollNext = () => emblaApi && emblaApi.scrollNext()

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex aspect-video">
          {images.map((imageUrl, index) => (
            <div key={imageUrl} className="flex-[0_0_100%] relative">
              <ImageDialog
                images={images}
                make={make}
                model={model}
                price={price}
                initialIndex={index}
              >
                <div className="relative w-full h-full cursor-pointer">
                  <Image
                    src={imageUrl}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </ImageDialog>
            </div>
          ))}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
        onClick={(e) => {
          e.stopPropagation()
          scrollPrev()
        }}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
        onClick={(e) => {
          e.stopPropagation()
          scrollNext()
        }}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  )
} 