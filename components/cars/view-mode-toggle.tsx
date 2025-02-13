"use client"

import { Button } from "@/components/ui/button"
import { LayoutGrid, List } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"

export function ViewModeToggle() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const view = searchParams.get('view') || 'grid'

  const setView = (newView: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('view', newView)
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className={cn(view === "grid" && "bg-accent")}
        onClick={() => setView("grid")}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={cn(view === "list" && "bg-accent")}
        onClick={() => setView("list")}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  )
} 