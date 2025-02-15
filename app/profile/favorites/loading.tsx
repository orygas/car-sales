import { Loading } from "@/components/ui/loading"

export default function FavoritesLoading() {
  return (
    <div className="container py-6">
      {/* Page header */}
      <div className="mb-10">
        <Loading variant="text" count={2} className="max-w-2xl" />
      </div>

      {/* Results header */}
      <div className="mb-6 flex items-center justify-between">
        <Loading variant="text" count={1} className="w-32" />
        <Loading variant="text" count={1} className="w-20" />
      </div>

      {/* Favorites grid */}
      <Loading 
        variant="grid" 
        count={6} 
        cols={3}
        aspectRatio="4/3"
      />
    </div>
  )
} 