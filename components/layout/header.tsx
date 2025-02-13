"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SignedIn, SignedOut, useUser, SignOutButton } from "@clerk/nextjs"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SignInForm } from "@/components/auth/sign-in-form"
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
import { User, LogOut, Menu, Car, Heart } from "lucide-react"

export function Header() {
  const { user } = useUser();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between">
        <Link href="/" className="font-semibold">
          Auto Market
        </Link>

        {/* Desktop Navigation (768px and above) */}
        <div className="hidden md:flex items-center gap-4">
          <SignedOut>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Sign In</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Welcome Back</DialogTitle>
                  <DialogDescription>
                    Sign in to your account or create a new one
                  </DialogDescription>
                </DialogHeader>
                <SignInForm />
              </DialogContent>
            </Dialog>
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
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 pt-6">
                <SignedOut>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <User className="mr-2 h-4 w-4" />
                        Sign In
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Welcome Back</DialogTitle>
                        <DialogDescription>
                          Sign in to your account or create a new one
                        </DialogDescription>
                      </DialogHeader>
                      <SignInForm />
                    </DialogContent>
                  </Dialog>
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
                    <Link href="/favorites">
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
    </header>
  )
} 