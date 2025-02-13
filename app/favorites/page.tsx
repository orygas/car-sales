import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { CarGrid } from "@/components/cars/car-grid"
import { ViewModeToggle } from "@/components/cars/view-mode-toggle"
import type { Car } from "@/lib/types"

async function getFavorites() {
  const { userId } = await auth()
  if (!userId) return []

  const { data: favorites, error } = await supabase
    .from('user_favorites')
    .select(`
      car_id,
      cars (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching favorites:', error)
    return []
  }

  return favorites.map(f => f.cars) as Car[]
}

export default async function FavoritesPage({
  searchParams
}: {
  searchParams: { view?: string }
}) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const favorites = await getFavorites()
  const view = (searchParams.view as "grid" | "list") || "grid"

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Favorites</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Found {favorites.length} favorite {favorites.length === 1 ? 'car' : 'cars'}
          </p>
        </div>
        <ViewModeToggle />
      </div>

      <CarGrid 
        listings={favorites} 
        view={view}
        favoritedCarIds={favorites.map(f => f.id)}
      />
    </div>
  )
} 