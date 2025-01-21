"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export function BackButton() {
  return (
    <Button 
      variant="ghost" 
      size="sm"
      className="flex items-center gap-2 hover:bg-transparent -ml-2"
      onClick={() => window.history.back()}
    >
      <ChevronLeft className="h-4 w-4" />
      Back
    </Button>
  )
} 