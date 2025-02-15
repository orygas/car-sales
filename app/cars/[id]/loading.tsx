import { Loading } from "@/components/ui/loading"

export default function CarDetailsLoading() {
  return (
    <div className="container py-6">
      {/* Back button */}
      <div className="mb-6">
        <Loading variant="text" count={1} className="w-24" />
      </div>

      {/* Main content */}
      <div className="space-y-8">
        {/* Main image */}
        <Loading variant="card" aspectRatio="16/9" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and price */}
            <Loading variant="text" count={2} />

            {/* Gallery */}
            <Loading variant="grid" count={4} cols={4} aspectRatio="1" />

            {/* Description */}
            <Loading variant="text" count={4} />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Price card */}
            <Loading variant="card" rows={3} />

            {/* Seller card */}
            <Loading variant="card" rows={4} />
          </div>
        </div>
      </div>
    </div>
  )
} 