"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X, Share2, Heart } from "lucide-react"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import useEmblaCarousel from 'embla-carousel-react'

interface ImageDialogProps {
  images: string[]
  make: string
  model: string
  price: number
  initialIndex?: number
  children: React.ReactNode
}

export function ImageDialog({ 
  images, 
  make, 
  model, 
  price, 
  initialIndex = 0,
  children 
}: ImageDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isMobile, setIsMobile] = useState(false)
  const [isGridView, setIsGridView] = useState(true)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, startIndex: initialIndex })

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', () => {
        setCurrentIndex(emblaApi.selectedScrollSnap())
      })
    }
  }, [emblaApi])

  const showImage = (index: number) => {
    setCurrentIndex(index)
    if (isMobile) {
      setIsGridView(false)
    }
    if (emblaApi) {
      emblaApi.scrollTo(index)
    }
  }

  const nextImage = () => {
    if (emblaApi) emblaApi.scrollNext()
  }

  const previousImage = () => {
    if (emblaApi) emblaApi.scrollPrev()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogTitle className="sr-only">{make} {model} Image Gallery</DialogTitle>
      <DialogContent 
        className="max-w-screen h-[100dvh] p-0 bg-background" 
        onPointerDownOutside={(e) => {
          const target = e.target as HTMLElement
          if (target.closest('.embla') || target.closest('button')) return
          const closeButton = document.querySelector('[data-dialog-close]') as HTMLButtonElement
          closeButton?.click()
        }}
      >
        {isMobile ? (
          // Mobile Layout
          <>
            {isGridView ? (
              <div className="h-[100dvh] overflow-y-auto">
                <div className="sticky top-0 z-10 flex flex-col bg-background/95 backdrop-blur supports-[height:100dvh]:pt-[env(safe-area-inset-top)]">
                  <div className="flex items-center justify-between p-4">
                    <DialogClose asChild>
                      <Button variant="ghost" size="icon" className="text-foreground">
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                    </DialogClose>
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="icon">
                        <Share2 className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Heart className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <h2 className="text-lg font-semibold">{make} {model}</h2>
                    <p className="text-xl font-bold">{formatPrice(price)} PLN</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 p-4 supports-[height:100dvh]:pb-[env(safe-area-inset-bottom)]">
                  {images.map((image, index) => (
                    <div
                      key={image}
                      className="relative aspect-video cursor-pointer rounded-md overflow-hidden"
                      onClick={() => showImage(index)}
                    >
                      <Image
                        src={image}
                        alt={`${make} ${model} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="relative h-[100dvh] flex flex-col bg-black">
                <div className="absolute supports-[height:100dvh]:top-[env(safe-area-inset-top)] left-4 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsGridView(true)}
                    className="text-white"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                </div>
                <div className="flex-1 relative overflow-hidden embla" ref={emblaRef}>
                  <div className="flex h-full touch-pan-y">
                    {images.map((image, index) => (
                      <div key={image} className="flex-[0_0_100%] h-full relative">
                        <Image
                          src={image}
                          alt={`${make} ${model} - Image ${index + 1}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute supports-[height:100dvh]:bottom-[env(safe-area-inset-bottom)] right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentIndex + 1} / {images.length}
                </div>
              </div>
            )}
          </>
        ) : (
          // Desktop Layout
          <div className="relative h-full flex flex-col">
            <div className="flex items-center justify-between p-4 bg-background/95 backdrop-blur">
              <div className="flex items-center gap-4">
                <DialogClose asChild>
                  <Button variant="ghost" size="icon" className="text-foreground">
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                </DialogClose>
                <div>
                  <h2 className="text-lg font-semibold uppercase">{make} {model}</h2>
                  <p className="text-muted-foreground">{formatPrice(price)} zł</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="invisible">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 relative overflow-hidden embla" ref={emblaRef}>
              <div className="flex h-full">
                {images.map((image, index) => (
                  <div key={image} className="flex-[0_0_100%] h-full relative">
                    <Image
                      src={image}
                      alt={`${make} ${model} - Image ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white"
                onClick={previousImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {images.length}
              </div>
            </div>
            <div className="p-4 bg-background/95 backdrop-blur">
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={image}
                    onClick={() => showImage(index)}
                    className={`relative w-20 aspect-video flex-shrink-0 rounded-sm overflow-hidden ${
                      currentIndex === index ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${make} ${model} - Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 