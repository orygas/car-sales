import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { formatPrice } from "@/lib/utils"
import { notFound } from "next/navigation"
import { CarouselWrapper } from "@/components/cars/carousel-wrapper"
import { BackButton } from "@/components/cars/back-button"
import { Share2, Heart, Calendar, Gauge, Car, Fuel } from "lucide-react"

interface Car {
  id: string
  // Basic Information
  make: string
  model: string
  year: number
  price: number
  condition: string
  mileage: number
  
  // Technical Details
  transmission: string
  fuel_type: string
  vin: string | null
  has_tuning: boolean
  
  // History & Status
  is_first_owner: boolean
  is_accident_free: boolean
  is_damaged: boolean
  is_serviced_at_dealer: boolean
  
  // Registration & Import
  is_registered: boolean
  registration_number: string
  first_registration_date: string
  show_registration_info: boolean
  is_imported: boolean
  import_country?: string
  
  // Other
  location: string
  description: string
  images: string[]
  seller_name: string
  seller_phone: string
}

async function getCarListing(id: string) {
  const { data: listing, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !listing) {
    console.error('Error fetching car listing:', error)
    return null
  }

  return listing as Car
}

const BasicDetails = ({ listing }: { listing: Car }) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
    {[
      { icon: Calendar, label: "Year", value: listing.year },
      { icon: Gauge, label: "Mileage", value: `${listing.mileage.toLocaleString()} km` },
      { icon: Car, label: "Transmission", value: listing.transmission },
      { icon: Fuel, label: "Fuel Type", value: listing.fuel_type },
    ].map(({ icon: Icon, label, value }) => (
      <Card key={label} className="p-4">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        <p className="text-sm font-medium mt-1 capitalize">{value}</p>
      </Card>
    ))}
  </div>
)

const AdvancedDetails = ({ listing }: { listing: Car }) => (
  <Card className="p-4 sm:p-6">
    <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <dt className="text-sm text-muted-foreground">Condition</dt>
        <dd className="text-sm font-medium capitalize">{listing.condition}</dd>
      </div>
      <div>
        <dt className="text-sm text-muted-foreground">First Owner</dt>
        <dd className="text-sm font-medium">{listing.is_first_owner ? "Yes" : "No"}</dd>
      </div>
      <div>
        <dt className="text-sm text-muted-foreground">Accident History</dt>
        <dd className="text-sm font-medium">{listing.is_accident_free ? "Accident Free" : "Has History"}</dd>
      </div>
      <div>
        <dt className="text-sm text-muted-foreground">Service History</dt>
        <dd className="text-sm font-medium">{listing.is_serviced_at_dealer ? "Dealer Serviced" : "Not Dealer Serviced"}</dd>
      </div>
      {listing.show_registration_info && (
        <>
          <div>
            <dt className="text-sm text-muted-foreground">Registration Number</dt>
            <dd className="text-sm font-medium">{listing.registration_number}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">First Registration</dt>
            <dd className="text-sm font-medium">{listing.first_registration_date}</dd>
          </div>
        </>
      )}
      {listing.is_imported && (
        <div>
          <dt className="text-sm text-muted-foreground">Import Information</dt>
          <dd className="text-sm font-medium">Imported from {listing.import_country}</dd>
        </div>
      )}
      {listing.vin && (
        <div>
          <dt className="text-sm text-muted-foreground">VIN</dt>
          <dd className="text-sm font-medium">{listing.vin}</dd>
        </div>
      )}
    </dl>
  </Card>
)

const SellerInfo = ({ listing }: { listing: Car }) => (
  <Card className="p-4 sm:p-6">
    <h2 className="text-lg font-semibold mb-4">Seller Information</h2>
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">Name</p>
        <p className="text-sm font-medium">{listing.seller_name}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Location</p>
        <p className="text-sm font-medium">{listing.location}</p>
      </div>
      <Button className="w-full" variant="default">
        Show Phone Number
      </Button>
    </div>
  </Card>
)

export async function generateStaticParams() {
  const { data: listings } = await supabase.from('cars').select('id')
  return listings?.map((listing) => ({
    id: listing.id,
  })) || []
}

export default async function CarPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const listing = await getCarListing(params.id)

  if (!listing) {
    notFound()
  }

  return (
    <div className="container py-4 sm:py-6">
      <div className="space-y-6">
        {/* Header Actions */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">
                  {listing.make.toUpperCase()} {listing.model.toUpperCase()}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-xl sm:text-2xl font-bold text-primary">
                {formatPrice(listing.price)} zł
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Image Carousel */}
        <Card className="p-0">
          <CarouselWrapper 
            images={listing.images} 
            make={listing.make} 
            model={listing.model}
            price={listing.price}
          />
        </Card>

        {/* Basic Details */}
        <BasicDetails listing={listing} />

        {/* Description */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">Description</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{listing.description}</p>
        </Card>

        {/* Advanced Details and Seller Info */}
        <div className="grid gap-6 md:grid-cols-2">
          <AdvancedDetails listing={listing} />
          <SellerInfo listing={listing} />
        </div>
      </div>
    </div>
  )
} 