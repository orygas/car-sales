import { Header } from "@/components/layout/header"
import { SearchBar } from "@/components/cars/search-bar"
import { FeaturedListings } from "@/components/cars/featured-listings"

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <Header />
      <SearchBar />
      <FeaturedListings />
    </div>
  )
}
