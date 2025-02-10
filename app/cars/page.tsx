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
type SearchParams = { [key: string]: string | string[] | undefined }

const ITEMS_PER_PAGE = 9

const buildQuery = (params: SearchParams) => {
  const query = supabase.from('cars').select('*')
  const filters = {
    make: (v: string) => query.eq('make', v),
    model: (v: string) => query.eq('model', v),
    yearFrom: (v: string) => query.gte('year', parseInt(v)),
    yearTo: (v: string) => query.lte('year', parseInt(v)),
    transmission: (v: string) => query.eq('transmission', v),
    fuelType: (v: string) => query.eq('fuel_type', v),
    mileageFrom: (v: string) => query.gte('mileage', parseInt(v)),
    mileageTo: (v: string) => query.lte('mileage', parseInt(v)),
    priceRange: (v: string) => {
      const [min, max] = v.split('-')
      if (min) query.gte('price', parseInt(min))
      if (max && max !== '+') query.lte('price', parseInt(max))
      return query
    },
    keyword: (v: string) => query.or(`description.ilike.%${v}%,make.ilike.%${v}%,model.ilike.%${v}%`)
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value && key in filters) {
      filters[key as keyof typeof filters](value as string)
    }
  })

  return query.order('created_at', { ascending: false })
}

const CarGrid = ({ listings }: { listings: CarListingWithId[] }) => (
  <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
    {listings.map(({ id, make, model, year, mileage, price, images }) => (
      <Link key={id} href={`/cars/${id}`}>
        <Card className="h-full hover:shadow-lg transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="relative aspect-video rounded-lg overflow-hidden mb-3 sm:mb-4">
              <Image src={images[0]} alt={`${make} ${model}`} fill className="object-cover" />
            </div>
            <h3 className="font-semibold text-base sm:text-lg">
              {make.toUpperCase()} {model.toUpperCase()}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {year} • {mileage.toLocaleString()} km
            </p>
            <p className="font-bold text-sm sm:text-base mt-1 sm:mt-2">{formatPrice(price)} zł</p>
          </CardContent>
        </Card>
      </Link>
    ))}
  </div>
)

const CarList = ({ listings }: { listings: CarListingWithId[] }) => (
  <div className="space-y-4">
    {listings.map(({ id, make, model, year, mileage, price, images }) => (
      <Link key={id} href={`/cars/${id}`} className="block my-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative w-full sm:w-48 aspect-video rounded-lg overflow-hidden">
                <Image src={images[0]} alt={`${make} ${model}`} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base sm:text-lg">
                  {make.toUpperCase()} {model.toUpperCase()}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {year} • {mileage.toLocaleString()} km
                </p>
                <p className="font-bold text-sm sm:text-base mt-1 sm:mt-2">{formatPrice(price)} zł</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    ))}
  </div>
)

const ViewToggle = ({ view, createQueryString }: { 
  view: string, 
  createQueryString: (params: Record<string, string | number>) => { query: Record<string, string | number> } 
}) => (
  <div className="flex gap-2">
    {[
      { type: 'grid', icon: LayoutGrid },
      { type: 'list', icon: List }
    ].map(({ type, icon: Icon }) => (
      <Button key={type} variant={view === type ? 'default' : 'outline'} size="icon" asChild>
        <Link href={createQueryString({ view: type })}>
          <Icon className="h-4 w-4" />
        </Link>
      </Button>
    ))}
  </div>
)

export default async function CarsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const view = (params.view as string) || 'grid'
  
  const { data: listings = [], error } = await buildQuery(params)
  if (error) console.error('Error fetching listings:', error)
  
  const allListings = listings as CarListingWithId[]
  const totalPages = Math.ceil(allListings.length / ITEMS_PER_PAGE)
  const currentListings = allListings.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const baseQuery = Object.entries(params).reduce((acc, [key, value]) => 
    value ? { ...acc, [key]: String(value) } : acc, 
    {} as Record<string, string>
  )

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
        <ViewToggle view={view} createQueryString={createQueryString} />
      </div>

      {currentListings.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No cars found matching your criteria.
        </div>
      ) : view === 'grid' ? (
        <CarGrid listings={currentListings} />
      ) : (
        <CarList listings={currentListings} />
      )}

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href={createQueryString({ page: page > 1 ? page - 1 : 1 })} />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink href={createQueryString({ page: p })} isActive={p === page}>
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext href={createQueryString({ page: page < totalPages ? page + 1 : totalPages })} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
