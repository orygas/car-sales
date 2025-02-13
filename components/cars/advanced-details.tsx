import { Card } from "@/components/ui/card"
import { Car } from "@/lib/types"

export function AdvancedDetails({ listing }: { listing: Car }) {
  return (
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
} 