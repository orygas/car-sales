import { auth } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"
import { FeaturedListings } from "@/components/cars/featured-listings"
import { SearchBar } from "@/components/cars/search-bar"
import { PopularBrands } from "@/components/cars/popular-brands"
import type { Car } from "@/lib/types"

async function getFeaturedListings() {
  const { data: listings, error } = await supabase
    .from('cars')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) {
    console.error('Error fetching featured listings:', error)
    return []
  }

  return listings as Car[]
}

async function getFavorites(userId: string | null) {
  if (!userId) return new Set<string>()

  const { data: favorites } = await supabase
    .from('user_favorites')
    .select('car_id')
    .eq('user_id', userId)

  return new Set(favorites?.map(f => f.car_id) || [])
}

export default async function HomePage() {
  const { userId } = await auth()
  const [listings] = await Promise.all([
    getFeaturedListings(),
    getFavorites(userId)
  ])

  return (
    <main className="container py-6">
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold">Welcome to Auto Market</h1>
        <p className="text-xl text-muted-foreground">
          Find your perfect car from thousands of listings
        </p>
      </div>

      <div className="mb-10">
        <SearchBar />
      </div>

      <div className="space-y-10">
        <FeaturedListings listings={listings} />
        
        <div>
          <h2 className="text-2xl font-bold mb-6">Popular Brands</h2>
          <PopularBrands />
        </div>
      </div>
    </main>
  )
}
