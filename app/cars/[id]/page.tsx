import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/lib/supabase"
import { formatPrice } from "@/lib/utils"
import { notFound } from "next/navigation"
import { CarouselWrapper } from "@/components/cars/carousel-wrapper"
import { BackButton } from "@/components/cars/back-button"

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

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CarPage({ params }: PageProps) {
  const { id } = await params
  const listing = await getCarListing(id)

  if (!listing) {
    notFound()
  }

  return (
    <div className="container py-4 sm:py-6 lg:py-10">
      <div className="space-y-4 sm:space-y-6">
        <BackButton />

        <div className="grid gap-4 sm:gap-6 xl:grid-cols-[1fr,400px]">
          <div className="space-y-4 sm:space-y-6">
            <Card className="rounded-lg p-0 sm:p-6">
              <div className="relative">
                <CarouselWrapper 
                  images={listing.images} 
                  make={listing.make} 
                  model={listing.model} 
                  price={listing.price} 
                />
              </div>
            </Card>

            <Card className="rounded-lg p-4 sm:p-6 xl:hidden">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">{listing.make.toUpperCase()} {listing.model.toUpperCase()}</h1>
                  <p className="text-xl sm:text-2xl font-bold text-primary mt-2">{formatPrice(listing.price)} zł</p>
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">Details</h2>
                  <Separator className="my-4" />
                  <dl className="grid grid-cols-1 gap-4">
                    {/* Basic Information */}
                    <div>
                      <dt className="text-sm text-muted-foreground">Year</dt>
                      <dd className="text-sm font-medium">{listing.year}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Condition</dt>
                      <dd className="text-sm font-medium capitalize">{listing.condition}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Mileage</dt>
                      <dd className="text-sm font-medium">{listing.mileage.toLocaleString()} km</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Location</dt>
                      <dd className="text-sm font-medium">{listing.location}</dd>
                    </div>

                    <Separator className="my-2" />

                    {/* Technical Details */}
                    <div>
                      <dt className="text-sm text-muted-foreground">Transmission</dt>
                      <dd className="text-sm font-medium capitalize">{listing.transmission}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Fuel Type</dt>
                      <dd className="text-sm font-medium capitalize">{listing.fuel_type}</dd>
                    </div>
                    {listing.vin && (
                      <div>
                        <dt className="text-sm text-muted-foreground">VIN</dt>
                        <dd className="text-sm font-medium">{listing.vin}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-sm text-muted-foreground">Modifications</dt>
                      <dd className="text-sm font-medium">{listing.has_tuning ? "Modified" : "Stock"}</dd>
                    </div>

                    <Separator className="my-2" />

                    {/* History & Status */}
                    <div>
                      <dt className="text-sm text-muted-foreground">First Owner</dt>
                      <dd className="text-sm font-medium">{listing.is_first_owner ? "Yes" : "No"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Accident History</dt>
                      <dd className="text-sm font-medium">{listing.is_accident_free ? "Accident Free" : "Has Accident History"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Damage Status</dt>
                      <dd className="text-sm font-medium">{listing.is_damaged ? "Damaged" : "Not Damaged"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Service History</dt>
                      <dd className="text-sm font-medium">
                        {listing.is_serviced_at_dealer ? "Dealer Serviced" : "Not Dealer Serviced"}
                      </dd>
                    </div>

                    <Separator className="my-2" />

                    {/* Registration & Import */}
                    <div>
                      <dt className="text-sm text-muted-foreground">Registration Status</dt>
                      <dd className="text-sm font-medium">{listing.is_registered ? "Registered" : "Not Registered"}</dd>
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
                    <div>
                      <dt className="text-sm text-muted-foreground">Import Status</dt>
                      <dd className="text-sm font-medium">
                        {listing.is_imported ? `Imported from ${listing.import_country}` : "Not Imported"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </Card>

            <Card className="rounded-lg p-4 sm:p-6 w-full">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Description</h2>
              <Separator className="mb-4" />
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{listing.description}</p>
            </Card>
          </div>

          <Card className="rounded-lg p-4 sm:p-6 hidden xl:block">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">{listing.make.toUpperCase()} {listing.model.toUpperCase()}</h1>
                <p className="text-xl sm:text-2xl font-bold text-primary mt-2">{formatPrice(listing.price)} zł</p>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-semibold">Details</h2>
                <Separator className="my-4" />
                <dl className="grid grid-cols-1 gap-4">
                  {/* Basic Information */}
                  <div>
                    <dt className="text-sm text-muted-foreground">Year</dt>
                    <dd className="text-sm font-medium">{listing.year}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Condition</dt>
                    <dd className="text-sm font-medium capitalize">{listing.condition}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Mileage</dt>
                    <dd className="text-sm font-medium">{listing.mileage.toLocaleString()} km</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Location</dt>
                    <dd className="text-sm font-medium">{listing.location}</dd>
                  </div>

                  <Separator className="my-2" />

                  {/* Technical Details */}
                  <div>
                    <dt className="text-sm text-muted-foreground">Transmission</dt>
                    <dd className="text-sm font-medium capitalize">{listing.transmission}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Fuel Type</dt>
                    <dd className="text-sm font-medium capitalize">{listing.fuel_type}</dd>
                  </div>
                  {listing.vin && (
                    <div>
                      <dt className="text-sm text-muted-foreground">VIN</dt>
                      <dd className="text-sm font-medium">{listing.vin}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm text-muted-foreground">Modifications</dt>
                    <dd className="text-sm font-medium">{listing.has_tuning ? "Modified" : "Stock"}</dd>
                  </div>

                  <Separator className="my-2" />

                  {/* History & Status */}
                  <div>
                    <dt className="text-sm text-muted-foreground">First Owner</dt>
                    <dd className="text-sm font-medium">{listing.is_first_owner ? "Yes" : "No"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Accident History</dt>
                    <dd className="text-sm font-medium">{listing.is_accident_free ? "Accident Free" : "Has Accident History"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Damage Status</dt>
                    <dd className="text-sm font-medium">{listing.is_damaged ? "Damaged" : "Not Damaged"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Service History</dt>
                    <dd className="text-sm font-medium">
                      {listing.is_serviced_at_dealer ? "Dealer Serviced" : "Not Dealer Serviced"}
                    </dd>
                  </div>

                  <Separator className="my-2" />

                  {/* Registration & Import */}
                  <div>
                    <dt className="text-sm text-muted-foreground">Registration Status</dt>
                    <dd className="text-sm font-medium">{listing.is_registered ? "Registered" : "Not Registered"}</dd>
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
                  <div>
                    <dt className="text-sm text-muted-foreground">Import Status</dt>
                    <dd className="text-sm font-medium">
                      {listing.is_imported ? `Imported from ${listing.import_country}` : "Not Imported"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 