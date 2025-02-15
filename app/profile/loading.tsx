import { Loading } from "@/components/ui/loading"

export default function ProfileLoading() {
  return (
    <div className="container py-6">
      {/* Profile header */}
      <div className="mb-10">
        <Loading variant="text" count={2} className="max-w-2xl" />
      </div>

      {/* Profile info */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* User info card */}
        <Loading variant="card" rows={4} />
        
        {/* Stats cards */}
        <Loading variant="card" rows={3} />
        <Loading variant="card" rows={3} />
      </div>

      {/* Recent activity */}
      <div className="mt-8">
        <Loading variant="text" count={1} className="mb-4" />
        <Loading variant="list" count={3} aspectRatio="4/3" />
      </div>
    </div>
  )
} 