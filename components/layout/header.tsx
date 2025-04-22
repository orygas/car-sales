"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SignedIn, SignedOut, useUser, SignOutButton } from "@clerk/nextjs"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LogOut, Menu, Car, Heart, Github } from "lucide-react"

export function Header() {
  const { user } = useUser();
  
  return (
    <div className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Main Header */}
      <div className="w-full border-b-0">
        <div className="container mx-auto flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-semibold">
              Auto Market
            </Link>
            <Button variant="ghost" size="sm" asChild className="gap-1">
              <Link href="/cars">
                Browse
              </Link>
            </Button>
          </div>

          {/* Desktop Navigation (768px and above) */}
          <div className="hidden md:flex items-center gap-4">
            <SignedOut>
              <Button variant="outline" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </SignedOut>

            <SignedIn>
              <Button asChild variant="default">
                <Link href="/cars/new">
                  Sell Your Car
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.imageUrl} alt={user?.username || ""} />
                      <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.emailAddresses[0]?.emailAddress}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/listings">
                      <Car className="mr-2 h-4 w-4" />
                      My Listings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/favorites">
                      <Heart className="mr-2 h-4 w-4" />
                      Favorites
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <SignOutButton>
                      <div className="flex w-full items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </div>
                    </SignOutButton>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SignedIn>

            <ThemeToggle />
          </div>

          {/* Mobile Navigation (below 768px) */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 pt-6">
                  <SignedOut>
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link href="/sign-in">
                        <User className="mr-2 h-4 w-4" />
                        Sign In
                      </Link>
                    </Button>
                  </SignedOut>

                  <SignedIn>
                    <div className="flex items-center gap-3 px-2 mb-2">
                      <Avatar>
                        <AvatarImage src={user?.imageUrl} alt={user?.username || ""} />
                        <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium leading-none">{user?.username}</p>
                        <p className="text-xs text-muted-foreground">{user?.emailAddresses[0]?.emailAddress}</p>
                      </div>
                    </div>
                    <Button asChild variant="ghost" className="w-full justify-start">
                      <Link href="/cars">
                        Browse Cars
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start">
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start">
                      <Link href="/profile/listings">
                        <Car className="mr-2 h-4 w-4" />
                        My Listings
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start">
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
                    <Button asChild variant="default" className="w-full justify-start">
                      <Link href="/cars/new">
                        <Car className="mr-2 h-4 w-4" />
                        Sell Your Car
                      </Link>
                    </Button>
                  </SignedIn>

                  <div className="space-y-4">
                    <div className="h-[1px] bg-border" />
                    <ThemeToggle className="w-full justify-start" showLabel />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Demo Banner */}
      <div className="border-b py-1 shadow-sm rounded-b-md">
        <div className="text-center flex items-center justify-center gap-2">
          <span className="font-medium">Demo Version</span>
          <Link 
            href="https://github.com/orygas" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:underline text-primary"
          >
            <Github className="h-4 w-4 mr-1" />
            GitHub
          </Link>
        </div>
      </div>
    </div>
  )
} 