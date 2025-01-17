import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between">
        <Link href="/" className="font-semibold">
          Auto Market
        </Link>

        <div className="flex items-center gap-4">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
            <Button asChild variant="default">
              <Link href="/cars/new">Sell Your Car</Link>
            </Button>
          </SignedIn>
          
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline">Login</Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button variant="default">Sell Your Car</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  )
} 