"use client"

import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/utils"
import useEmblaCarousel from 'embla-carousel-react'
import { useEffect } from "react"

interface ImageDialogProps {
  image: string
  images: string[]
  initialIndex: number
  make: string
  model: string
  price: number
}

export function ImageDialog({ 
  image, 
  images, 
  initialIndex,
  make,
  model,
  price 
}: ImageDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [emblaRef, emblaApi] = useEmblaCarousel({ startIndex: initialIndex })

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', () => {
        setCurrentIndex(emblaApi.selectedScrollSnap())
      })
    }
  }, [emblaApi])

  const showNext = () => {
    if (emblaApi) emblaApi.scrollNext()
  }

  const showPrevious = () => {
    if (emblaApi) emblaApi.scrollPrev()
  }

  const showImage = (index: number) => {
    if (emblaApi) emblaApi.scrollTo(index)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={image}
              alt={`${make} ${model}`}
              fill
              className="rounded-lg object-cover"
            />
          </AspectRatio>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[100vw] w-full h-[100vh] p-0 [&>button]:hidden">
        <DialogTitle className="sr-only">
          {make} {model} Images
        </DialogTitle>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <DialogClose className="p-2 hover:bg-accent rounded-full">
                <ChevronLeft className="h-6 w-6" />
              </DialogClose>
              <h2 className="text-xl font-semibold">{make.toUpperCase()} {model.toUpperCase()}</h2>
            </div>
            <div>
              <p className="text-xl font-semibold">{formatPrice(price)} zł</p>
            </div>
          </div>

          {/* Main Image */}
          <div className="relative flex-1 bg-black">
            <div className="absolute inset-0" ref={emblaRef}>
              <div className="flex h-full">
                {images.map((imageUrl, index) => (
                  <div key={imageUrl} className="flex-[0_0_100%] min-w-0 relative h-full">
                    <Image
                      src={imageUrl}
                      alt={`${make} ${model} - Image ${index + 1} of ${images.length}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-md text-sm">
              {currentIndex + 1}/{images.length}
            </div>
            <button
              onClick={showPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={showNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="p-4 border-t bg-background">
            <div className="flex gap-2 overflow-x-auto">
              {images.map((imageUrl, index) => (
                <button
                  key={imageUrl}
                  onClick={() => showImage(index)}
                  className={cn(
                    "relative flex-shrink-0 w-[120px] h-[90px] rounded-sm overflow-hidden border-2",
                    currentIndex === index ? "border-primary" : "border-transparent"
                  )}
                  aria-label={`View image ${index + 1} of ${images.length}`}
                  aria-current={currentIndex === index}
                >
                  <Image
                    src={imageUrl}
                    alt={`${make} ${model} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 