"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Car } from "@/lib/types"

export function SellerInfo({ listing }: { listing: Car }) {
  const [showPhone, setShowPhone] = React.useState(false)

  return (
    <Card className="p-4 sm:p-6">
      <h2 className="text-lg font-semibold mb-4">Seller Information</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Name</p>
          <p className="text-sm font-medium">{listing.seller_name}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Location</p>
          <p className="text-sm font-medium">{listing.location}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Phone Number</p>
          {showPhone ? (
            <p className="text-sm font-medium">{listing.seller_phone}</p>
          ) : (
            <Button 
              className="w-full mt-2" 
              variant="default"
              onClick={() => setShowPhone(true)}
            >
              Show Phone Number
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
} 