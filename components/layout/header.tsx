import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="text-2xl font-bold hover:opacity-80">
          Auto Market
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/cars/new">Sell Your Car</Link>
          </Button>
        </div>
      </div>
    </header>
  )
} 