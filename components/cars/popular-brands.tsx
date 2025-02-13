"use client"

import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"

const POPULAR_BRANDS = [
  { id: "bmw", name: "BMW", logo: "/brands/bmw.svg" },
  { id: "mercedes-benz", name: "Mercedes-Benz", logo: "/brands/mercedes.svg" },
  { id: "audi", name: "Audi", logo: "/brands/audi.svg" },
  { id: "volkswagen", name: "Volkswagen", logo: "/brands/volkswagen.svg" },
  { id: "toyota", name: "Toyota", logo: "/brands/toyota.svg" },
  { id: "honda", name: "Honda", logo: "/brands/honda.svg" },
]

export function PopularBrands() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleBrandClick = (brandId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("make", brandId)
    router.push(`/cars?${params.toString()}`)
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {POPULAR_BRANDS.map((brand) => (
        <Button
          key={brand.id}
          variant="outline"
          className="h-auto p-6 flex flex-col items-center gap-4 hover:bg-accent"
          onClick={() => handleBrandClick(brand.id)}
        >
          <div className="relative w-12 h-12">
            <Image
              src={brand.logo}
              alt={brand.name}
              fill
              className="object-contain"
            />
          </div>
          <span className="text-sm font-medium">{brand.name}</span>
        </Button>
      ))}
    </div>
  )
} 