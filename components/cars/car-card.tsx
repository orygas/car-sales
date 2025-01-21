import { CarListing } from "@/lib/schemas/car"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"

interface CarCardProps {
  listing: CarListing & { id: string }
}

export function CarCard({ listing }: CarCardProps) {
  return (
    <Link href={`/cars/${listing.id}`}>
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
  )
} 