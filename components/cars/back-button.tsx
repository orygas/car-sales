"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export function BackButton() {
  return (
    <Button 
      variant="outline" 
      size="icon"
      onClick={() => window.history.back()}
    >
      <ChevronLeft className="h-4 w-4" />
    </Button>
  )
} 