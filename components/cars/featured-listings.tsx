import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FeaturedListings() {
  return (
    <div>
      <CardHeader className="px-0">
        <CardTitle className="text-2xl">Featured Listings</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="aspect-video bg-slate-200 rounded-lg mb-4" />
              <h3 className="font-semibold text-lg">BMW 3 Series {i}</h3>
              <p className="text-sm text-muted-foreground">2020 • 45,000 miles</p>
              <p className="font-bold mt-2">$25,000</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 