import { supabase } from "@/lib/supabase"
import { CarListing } from "@/lib/schemas/car"
import { SearchBar } from "@/components/cars/search-bar"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"

type CarListingWithId = CarListing & { id: string }

async function getFilteredListings(searchParams: { [key: string]: string | string[] | undefined }) {
  let query = supabase
    .from('cars')
    .select('*')

  const params = await searchParams

  if (params.make) {
    query = query.eq('make', params.make)
  }
  if (params.model) {
    query = query.eq('model', params.model)
  }
  if (params.yearFrom) {
    query = query.gte('year', parseInt(params.yearFrom as string))
  }
  if (params.yearTo) {
    query = query.lte('year', parseInt(params.yearTo as string))
  }
  if (params.transmission) {
    query = query.eq('transmission', params.transmission)
  }
  if (params.fuelType) {
    query = query.eq('fuel_type', params.fuelType)
  }
  if (params.mileageFrom) {
    query = query.gte('mileage', parseInt(params.mileageFrom as string))
  }
  if (params.mileageTo) {
    query = query.lte('mileage', parseInt(params.mileageTo as string))
  }
  if (params.priceRange) {
    const [min, max] = (params.priceRange as string).split('-')
    if (min) query = query.gte('price', parseInt(min))
    if (max && max !== '+') query = query.lte('price', parseInt(max))
  }
  if (params.keyword) {
    query = query.or(`description.ilike.%${params.keyword}%,make.ilike.%${params.keyword}%,model.ilike.%${params.keyword}%`)
  }

  const { data: listings, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching listings:', error)
    return []
  }

  return listings as CarListingWithId[]
}

export default async function CarsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const listings = await getFilteredListings(searchParams)

  return (
    <div className="container py-10">
      <div className="mb-8">
        <SearchBar />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <Link key={listing.id} href={`/cars/${listing.id}`}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                  <Image
                    src={listing.images[0]}
                    alt={`${listing.make} ${listing.model}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg">
                  {listing.make.toUpperCase()} {listing.model.toUpperCase()}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {listing.year} • {listing.mileage.toLocaleString()} km
                </p>
                <p className="font-bold mt-2">{formatPrice(listing.price)} zł</p>
              </CardContent>
            </Card>
          </Link>
        ))}
        {listings.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No cars found matching your criteria.
          </div>
        )}
      </div>
    </div>
  )
}
