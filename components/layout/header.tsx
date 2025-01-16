import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="flex justify-between items-center mb-10">
      <h1 className="text-4xl font-bold">Auto Market</h1>
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild className="h-10">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild className="h-10">
          <Link href="/cars/new">Sell Your Car</Link>
        </Button>
      </div>
    </header>
  )
} 