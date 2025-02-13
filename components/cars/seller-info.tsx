"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Car } from "@/lib/types"
import { MapPin, Phone, Shield } from "lucide-react"
import { useUser } from "@clerk/nextjs"

export function SellerInfo({ listing }: { listing: Car }) {
  const [showPhone, setShowPhone] = React.useState(false)
  const { user } = useUser()

  return (
    <Card className="p-4 sm:p-6">
      <h2 className="text-lg font-semibold mb-4">Seller Information</h2>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.imageUrl} alt={listing.seller_name} />
            <AvatarFallback>{listing.seller_name[0]}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium truncate">{listing.seller_name}</p>
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <Shield className="h-3.5 w-3.5" />
              <span>Verified Seller</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <p className="text-sm">{listing.location}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Phone className="h-4 w-4 shrink-0" />
              <p className="text-sm">Contact Phone</p>
            </div>
            {showPhone ? (
              <p className="text-sm font-medium pl-7">{listing.seller_phone}</p>
            ) : (
              <Button 
                className="w-full" 
                variant="default"
                onClick={() => setShowPhone(true)}
              >
                Show Phone Number
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
} 