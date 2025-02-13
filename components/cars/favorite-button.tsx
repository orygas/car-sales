"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface FavoriteButtonProps {
  carId: string
  initialFavorited: boolean
  variant?: "ghost" | "outline"
  withBackground?: boolean
}

export function FavoriteButton({ 
  carId, 
  initialFavorited, 
  variant = "outline",
  withBackground = false 
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [isLoading, setIsLoading] = useState(false)
  const { userId } = useAuth()

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!userId) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save cars to your favorites.",
        variant: "destructive",
      })
      return
    }

    if (isLoading) return

    try {
      setIsLoading(true)
      const response = await fetch('/api/favorites', {
        method: isFavorited ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carId }),
      })

      if (!response.ok) throw new Error('Failed to update favorite')

      setIsFavorited(!isFavorited)
      toast({
        title: isFavorited ? "Removed from favorites" : "Added to favorites",
        description: isFavorited 
          ? "This car has been removed from your favorites." 
          : "This car has been added to your favorites.",
      })
    } catch (error) {
      console.error('Error updating favorite:', error)
      toast({
        title: "Error",
        description: "Failed to update favorite. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size="icon"
      className={cn(
        isFavorited ? "text-destructive" : "",
        withBackground && "bg-background/70 hover:bg-background/90 backdrop-blur-sm"
      )}
      onClick={handleFavoriteClick}
      disabled={isLoading}
    >
      <Heart className="h-4 w-4" fill={isFavorited ? "currentColor" : "none"} />
    </Button>
  )
} 