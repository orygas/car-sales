"use client"

import { useUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CarGrid } from "@/components/cars/car-grid"
import { supabase } from "@/lib/supabase"
import { Car } from "@/lib/types"
import Link from "next/link"
import { Car as CarIcon, Heart, LogOut } from "lucide-react"
import { SignOutButton } from "@clerk/nextjs"
import { useEffect, useState } from "react"

async function getUserListings(userId: string): Promise<Car[]> {
  const { data: listings } = await supabase
    .from('cars')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(3)

  return listings as Car[] || []
}

function capitalizeFirstLetter(str: string) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}

export default function ProfilePage() {
  const { isLoaded, user } = useUser()
  const [listings, setListings] = useState<Car[]>([])
  const [isLoadingListings, setIsLoadingListings] = useState(true)

  useEffect(() => {
    if (user) {
      getUserListings(user.id)
        .then(setListings)
        .finally(() => setIsLoadingListings(false))
    }
  }, [user])

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!user) {
    redirect('/sign-in')
  }

  const userInitial = user.firstName?.[0] || user.emailAddresses[0]?.emailAddress?.[0] || '?'
  const firstName = capitalizeFirstLetter(user.firstName || '')
  const lastName = capitalizeFirstLetter(user.lastName || '')

  return (
    <div className="container py-6">
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold">Profile</h1>
        <p className="text-xl text-muted-foreground">
          Manage your account and listings
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-4">
        {/* Sidebar */}
        <Card className="p-6 md:col-span-1 h-fit">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.imageUrl || ''} alt={firstName} />
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
            <h1 className="mt-4 text-xl font-semibold">
              {firstName} {lastName}
            </h1>
            <p className="text-sm text-muted-foreground">{user.emailAddresses[0]?.emailAddress}</p>
          </div>

          <div className="mt-6 space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/profile/listings">
                <CarIcon className="mr-2 h-4 w-4" />
                My Listings
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/profile/favorites">
                <Heart className="mr-2 h-4 w-4" />
                Favorites
              </Link>
            </Button>
            <SignOutButton>
              <Button variant="destructive" className="w-full justify-start">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </SignOutButton>
          </div>
        </Card>

        {/* Main Content */}
        <div className="md:col-span-3">
          <Card className="p-6 h-full">
            <h2 className="text-lg font-semibold mb-4">Recent Listings</h2>
            {isLoadingListings ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                <p className="mt-4 text-sm text-muted-foreground">Loading listings...</p>
              </div>
            ) : listings.length > 0 ? (
              <>
                <CarGrid listings={listings} view="grid" />
                <div className="mt-4 text-center">
                  <Button asChild variant="outline">
                    <Link href="/profile/listings">View All Listings</Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <CarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No Listings Yet</h3>
                <p className="text-muted-foreground">Start selling your cars today</p>
                <Button asChild className="mt-4">
                  <Link href="/cars/new">Create Listing</Link>
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
} 