import { supabase } from "@/lib/supabase"
import type { Car } from "@/lib/types"
import { CarGrid } from "@/components/cars/car-grid"
import { SearchBar } from "@/components/cars/search-bar"
import { ViewModeToggle } from "@/components/cars/view-mode-toggle"
import { auth } from "@clerk/nextjs/server"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const ITEMS_PER_PAGE = 12

type SearchParams = { [key: string]: string | string[] | undefined }

async function getCarListings(params: SearchParams) {
  const searchParams = await params
  const page = Number(searchParams?.page) || 1
  const from = (page - 1) * ITEMS_PER_PAGE
  
  // First get the total count
  const { count } = await supabase
    .from('cars')
    .select('*', { count: 'exact', head: true })

  // Then get the paginated results with filters
  const baseQuery = supabase.from('cars').select('*')
  const filters = {
    make: (v: string) => baseQuery.eq('make', v),
    model: (v: string) => baseQuery.eq('model', v),
    yearFrom: (v: string) => baseQuery.gte('year', parseInt(v)),
    yearTo: (v: string) => baseQuery.lte('year', parseInt(v)),
    transmission: (v: string) => baseQuery.eq('transmission', v),
    fuelType: (v: string) => baseQuery.eq('fuel_type', v),
    mileageFrom: (v: string) => baseQuery.gte('mileage', parseInt(v)),
    mileageTo: (v: string) => baseQuery.lte('mileage', parseInt(v)),
    priceRange: (v: string) => {
      const [min, max] = v.split('-')
      if (min) baseQuery.gte('price', parseInt(min))
      if (max && max !== '+') baseQuery.lte('price', parseInt(max))
      return baseQuery
    },
    keyword: (v: string) => baseQuery.or(`description.ilike.%${v}%,make.ilike.%${v}%,model.ilike.%${v}%`)
  }

  const entries = Object.entries(searchParams)
  for (const [key, value] of entries) {
    if (value && key in filters) {
      filters[key as keyof typeof filters](value as string)
    }
  }

  const { data: listings, error } = await baseQuery
    .order('created_at', { ascending: false })
    .range(from, from + ITEMS_PER_PAGE - 1)

  if (error) {
    console.error('Error fetching car listings:', error)
    return { listings: [], totalPages: 0, totalCount: 0 }
  }

  return {
    listings: listings as Car[],
    totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE),
    totalCount: count || 0
  }
}

async function getFavorites(userId: string | null) {
  if (!userId) return new Set<string>()

  const { data: favorites } = await supabase
    .from('user_favorites')
    .select('car_id')
    .eq('user_id', userId)

  return new Set(favorites?.map(f => f.car_id) || [])
}

interface CarsPageClientProps {
  listings: Car[]
  totalPages: number
  totalCount: number
  initialFavorites: Set<string>
  page: number
  view: "grid" | "list"
  baseQuery: Record<string, string>
}

function CarsPageClient({ 
  listings, 
  totalPages, 
  totalCount, 
  initialFavorites,
  page,
  view,
  baseQuery
}: CarsPageClientProps) {
  const createQueryString = (newParams: Record<string, string | number>) => ({
    query: { ...baseQuery, ...newParams }
  })

  return (
    <div className="container py-6">
      <div className="mb-8">
        <SearchBar />
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          Found {totalCount} {totalCount === 1 ? 'car' : 'cars'}
        </p>
        <ViewModeToggle />
      </div>

      <CarGrid 
        listings={listings} 
        view={view}
        favoritedCarIds={Array.from(initialFavorites)}
      />

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

export default async function CarsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { userId } = await auth()
  const params = await searchParams
  const page = Number(params?.page) || 1
  const viewMode = params?.view?.toString() || "grid"
  const view = (viewMode === "list" ? "list" : "grid") as "grid" | "list"
  const baseQuery = Object.entries(params).reduce((acc, [key, value]) => 
    value ? { ...acc, [key]: String(value) } : acc, 
    {} as Record<string, string>
  )

  const { listings, totalPages, totalCount } = await getCarListings(searchParams)
  const favoritedCars = await getFavorites(userId)

  return (
    <CarsPageClient 
      listings={listings}
      totalPages={totalPages}
      totalCount={totalCount}
      initialFavorites={favoritedCars}
      page={page}
      view={view}
      baseQuery={baseQuery}
    />
  )
}
