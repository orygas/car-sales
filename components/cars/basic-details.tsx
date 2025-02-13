import { Calendar, Gauge, Car as CarIcon, Fuel } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Car } from "@/lib/types"

export function BasicDetails({ listing }: { listing: Car }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
      {[
        { icon: Calendar, label: "Year", value: listing.year },
        { icon: Gauge, label: "Mileage", value: `${listing.mileage.toLocaleString()} km` },
        { icon: CarIcon, label: "Transmission", value: listing.transmission },
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
} 