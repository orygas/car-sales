import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { ViewModeToggle } from "@/components/cars/view-mode-toggle"
import { Button } from "@/components/ui/button"
import { Car } from "@/lib/types"
import Link from "next/link"
import { Car as CarIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { CarCard } from "@/components/cars/car-card"

async function getUserListings(userId: string): Promise<Car[]> {
  const { data: listings } = await supabase
    .from('cars')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return listings as Car[] || []
}

type PageProps = {
  searchParams: Promise<{ view?: string }>
}

export default async function UserListingsPage({
  searchParams,
}: PageProps) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const [listings, params] = await Promise.all([
    getUserListings(userId),
    searchParams
  ])
  
  const view = (params.view as "grid" | "list") || "grid"

  return (
    <div className="container py-6">
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold">My Listings</h1>
        <p className="text-xl text-muted-foreground">
          Manage your car listings
        </p>
      </div>

      {listings.length > 0 ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Found {listings.length} {listings.length === 1 ? 'listing' : 'listings'}
            </p>
            <div className="flex items-center gap-4">
              <ViewModeToggle />
            </div>
          </div>

          <div className={view === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "flex flex-col gap-6"
          }>
            {listings.map((listing) => (
              <CarCard
                key={listing.id}
                car={listing}
                listMode={view === "list"}
                showActions
              />
            ))}
          </div>
        </>
      ) : (
        <Card className="p-6">
          <div className="text-center py-12">
            <CarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Listings Yet</h3>
            <p className="text-muted-foreground">Start selling your cars today</p>
            <Button asChild className="mt-4">
              <Link href="/cars/new">Create Listing</Link>
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
} 