import { supabase } from "@/lib/supabase"
import type { Car } from "@/lib/types"
import { CarGrid } from "@/components/cars/car-grid"
import { SearchBar } from "@/components/cars/search-bar"
import { ViewModeToggle } from "@/components/cars/view-mode-toggle"
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
  const page = Number(params?.page) || 1
  const from = (page - 1) * ITEMS_PER_PAGE
  
  // Build the query with filters
  const baseQuery = supabase.from('cars').select('*', { count: 'exact' })

  // Apply filters
  if (params.make) baseQuery.eq('make', params.make)
  if (params.model) baseQuery.eq('model', params.model)
  if (params.yearFrom) baseQuery.gte('year', parseInt(params.yearFrom as string))
  if (params.yearTo) baseQuery.lte('year', parseInt(params.yearTo as string))
  if (params.transmission) baseQuery.eq('transmission', params.transmission)
  if (params.fuelType) baseQuery.eq('fuel_type', params.fuelType)
  if (params.mileageFrom) baseQuery.gte('mileage', parseInt(params.mileageFrom as string))
  if (params.mileageTo) baseQuery.lte('mileage', parseInt(params.mileageTo as string))
  if (params.priceRange) {
    const [min, max] = (params.priceRange as string).split('-')
    if (min) baseQuery.gte('price', parseInt(min))
    if (max && max !== '+') baseQuery.lte('price', parseInt(max))
  }
  if (params.keyword) {
    baseQuery.or(`description.ilike.%${params.keyword}%,make.ilike.%${params.keyword}%,model.ilike.%${params.keyword}%`)
  }

  // Get the count and paginated results
  const { data: listings, error, count } = await baseQuery
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


interface CarsPageClientProps {
  listings: Car[]
  totalPages: number
  totalCount: number
  page: number
  view: "grid" | "list"
  baseQuery: Record<string, string>
}

function CarsPageClient({ 
  listings, 
  totalPages, 
  totalCount, 
  page,
  view,
  baseQuery
}: CarsPageClientProps) {
  const createQueryString = (newParams: Record<string, string | number>) => ({
    query: { ...baseQuery, ...newParams }
  })

  return (
    <div className="container py-6">
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold">Browse Cars</h1>
        <p className="text-xl text-muted-foreground">
          Find your next car from our extensive collection
        </p>
      </div>

      <div className="mb-8">
        <SearchBar />
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          Found {totalCount} {totalCount === 1 ? 'listing' : 'listings'}
        </p>
        <ViewModeToggle />
      </div>

      <CarGrid 
        listings={listings} 
        view={view}
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

type PageProps = {
  searchParams: Promise<SearchParams>
}

export default async function CarsPage({
  searchParams,
}: PageProps) {
  const resolvedParams = await searchParams
  const page = Number(resolvedParams?.page) || 1
  const viewMode = resolvedParams?.view?.toString() || "grid"
  const view = (viewMode === "list" ? "list" : "grid") as "grid" | "list"
  const baseQuery = Object.entries(resolvedParams).reduce((acc, [key, value]) => 
    value ? { ...acc, [key]: String(value) } : acc, 
    {} as Record<string, string>
  )

  const { listings, totalPages, totalCount } = await getCarListings(resolvedParams)

  return (
    <CarsPageClient 
      listings={listings}
      totalPages={totalPages}
      totalCount={totalCount}
      page={page}
      view={view}
      baseQuery={baseQuery}
    />
  )
}
