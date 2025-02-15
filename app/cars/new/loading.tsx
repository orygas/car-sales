import { Loading } from "@/components/ui/loading"

export default function NewCarLoading() {
  return (
    <div className="container py-6">
      {/* Page header */}
      <div className="mb-10">
        <Loading variant="text" count={2} className="max-w-2xl" />
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto">
        {/* Image upload */}
        <div className="mb-8">
          <Loading variant="card" aspectRatio="16/9" />
        </div>

        {/* Form fields */}
        <Loading variant="form" count={10} />

        {/* Submit button */}
        <div className="mt-8">
          <Loading variant="text" count={1} className="h-10 w-full max-w-sm" />
        </div>
      </div>
    </div>
  )
} 