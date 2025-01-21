import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"

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

  return listings
}

export async function FeaturedListings() {
  const listings = await getFeaturedListings()

  return (
    <div>
      <CardHeader className="px-0">
        <CardTitle className="text-2xl">Featured Listings</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <h3 className="font-semibold text-lg">{listing.make.toUpperCase()} {listing.model.toUpperCase()}</h3>
                <p className="text-sm text-muted-foreground">
                  {listing.year} • {listing.mileage.toLocaleString()} km
                </p>
                <p className="font-bold mt-2">{formatPrice(listing.price)} zł</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
} 