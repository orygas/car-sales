import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const keyword = formData.get('keyword')?.toString() || ''

    router.push(`/cars?${createQueryString('keyword', keyword)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        name="keyword"
        placeholder="Search by make, model, or description..."
        defaultValue={searchParams.get('keyword') || ''}
        className="max-w-xl"
      />
      <Button type="submit">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  )
} 