import { supabase } from "@/lib/supabase"
import { CarListing } from "@/lib/schemas/car"
import { SearchBar } from "@/components/cars/search-bar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { LayoutGrid, List } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"

type CarListingWithId = CarListing & { id: string }

const ITEMS_PER_PAGE = 9

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

function CarGrid({ listings }: { listings: CarListingWithId[] }) {
  return (
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
    </div>
  )
}

function CarList({ listings }: { listings: CarListingWithId[] }) {
  return (
    <div className="space-y-4">
      {listings.map((listing) => (
        <Link key={listing.id} href={`/cars/${listing.id}`}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="relative w-48 aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={listing.images[0]}
                    alt={`${listing.make} ${listing.model}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {listing.make.toUpperCase()} {listing.model.toUpperCase()}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {listing.year} • {listing.mileage.toLocaleString()} km
                  </p>
                  <p className="font-bold mt-2">{formatPrice(listing.price)} zł</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export default async function CarsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const view = (params.view as string) || 'grid'
  const allListings = await getFilteredListings(params)
  const totalPages = Math.ceil(allListings.length / ITEMS_PER_PAGE)
  const listings = allListings.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  // Create a clean query object with only string values
  const baseQuery = {
    ...(params.make && { make: String(params.make) }),
    ...(params.model && { model: String(params.model) }),
    ...(params.yearFrom && { yearFrom: String(params.yearFrom) }),
    ...(params.yearTo && { yearTo: String(params.yearTo) }),
    ...(params.transmission && { transmission: String(params.transmission) }),
    ...(params.fuelType && { fuelType: String(params.fuelType) }),
    ...(params.mileageFrom && { mileageFrom: String(params.mileageFrom) }),
    ...(params.mileageTo && { mileageTo: String(params.mileageTo) }),
    ...(params.priceRange && { priceRange: String(params.priceRange) }),
    ...(params.keyword && { keyword: String(params.keyword) }),
    ...(params.view && { view: String(params.view) }),
  }

  const createQueryString = (newParams: Record<string, string | number>) => ({
    query: { ...baseQuery, ...newParams }
  })

  return (
    <div className="container py-10">
      <div className="mb-8">
        <SearchBar />
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          Found {allListings.length} listings
        </p>
        <div className="flex gap-2">
          <Button
            variant={view === 'grid' ? 'default' : 'outline'}
            size="icon"
            asChild
          >
            <Link href={createQueryString({ view: 'grid' })}>
              <LayoutGrid className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="icon"
            asChild
          >
            <Link href={createQueryString({ view: 'list' })}>
              <List className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No cars found matching your criteria.
        </div>
      ) : view === 'grid' ? (
        <CarGrid listings={listings} />
      ) : (
        <CarList listings={listings} />
      )}

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={createQueryString({ page: page > 1 ? page - 1 : 1 })}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    href={createQueryString({ page: p })}
                    isActive={p === page}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href={createQueryString({ page: page < totalPages ? page + 1 : totalPages })}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
