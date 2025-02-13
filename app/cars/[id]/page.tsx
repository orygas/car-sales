import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { formatPrice } from "@/lib/utils"
import { notFound } from "next/navigation"
import { CarouselWrapper } from "@/components/cars/carousel-wrapper"
import { BackButton } from "@/components/cars/back-button"
import { Share2 } from "lucide-react"
import { SellerInfo } from "@/components/cars/seller-info"
import { BasicDetails } from "@/components/cars/basic-details"
import { AdvancedDetails } from "@/components/cars/advanced-details"
import { FavoriteButton } from "@/components/cars/favorite-button"
import { auth } from "@clerk/nextjs/server"
import type { Car } from "@/lib/types"

async function getCarListing(id: string) {
  const { data: listing, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !listing) {
    console.error('Error fetching car listing:', error)
    return null
  }

  return listing as Car
}

async function isFavorited(userId: string | null, carId: string) {
  if (!userId) return false

  const { data } = await supabase
    .from('user_favorites')
    .select('car_id')
    .eq('user_id', userId)
    .eq('car_id', carId)
    .single()

  return !!data
}

export async function generateStaticParams() {
  const { data: listings } = await supabase.from('cars').select('id')
  return listings?.map((listing) => ({
    id: listing.id,
  })) || []
}

export default async function CarPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { userId } = await auth()
  const listing = await getCarListing(params.id)
  const isInitiallyFavorited = await isFavorited(userId, params.id)

  if (!listing) {
    notFound()
  }

  return (
    <div className="container py-4 sm:py-6">
      <div className="space-y-6">
        {/* Header Actions */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">
                  {listing.make.toUpperCase()} {listing.model.toUpperCase()}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-xl sm:text-2xl font-bold text-primary">
                {formatPrice(listing.price)} zł
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <FavoriteButton 
                  carId={listing.id} 
                  initialFavorited={isInitiallyFavorited}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Image Carousel */}
        <Card className="p-0">
          <CarouselWrapper 
            images={listing.images} 
            make={listing.make} 
            model={listing.model}
            price={listing.price}
          />
        </Card>

        {/* Basic Details */}
        <BasicDetails listing={listing} />

        {/* Description */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">Description</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{listing.description}</p>
        </Card>

        {/* Advanced Details and Seller Info */}
        <div className="grid gap-6 md:grid-cols-2">
          <AdvancedDetails listing={listing} />
          <SellerInfo listing={listing} />
        </div>
      </div>
    </div>
  )
} 