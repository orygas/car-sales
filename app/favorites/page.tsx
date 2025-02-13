import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { CarGrid } from "@/components/cars/car-grid"
import { ViewModeToggle } from "@/components/cars/view-mode-toggle"
import type { Car } from "@/lib/types"

interface FavoriteWithCar {
  car_id: string
  cars: Car
}

async function getFavorites(): Promise<Car[]> {
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

  return (favorites as unknown as FavoriteWithCar[]).map(f => f.cars)
}

export default async function FavoritesPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }> | { view?: string }
}) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const [favorites, params] = await Promise.all([
    getFavorites(),
    Promise.resolve(searchParams)
  ])
  
  const view = (params.view as "grid" | "list") || "grid"

  return (
    <div className="container py-6">
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold">My Favorites</h1>
        <p className="text-xl text-muted-foreground">
          Cars you&apos;ve saved for later
        </p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          Found {favorites.length} favorite {favorites.length === 1 ? 'car' : 'cars'}
        </p>
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