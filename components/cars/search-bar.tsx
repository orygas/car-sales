"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getCarMakes, getCarModels, type CarMake, type CarModel } from "@/lib/utils"
import { useEffect, useState } from "react"
import { ChevronDown, ChevronUp, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useRouter, useSearchParams } from "next/navigation"

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [makes, setMakes] = useState<CarMake[]>([])
  const [models, setModels] = useState<CarModel[]>([])
  const [loading, setLoading] = useState(true)
  const [modelLoading, setModelLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [open, setOpen] = useState(false)
  const [modelOpen, setModelOpen] = useState(false)
  const [value, setValue] = useState(searchParams.get("make") || "")
  const [modelValue, setModelValue] = useState(searchParams.get("model") || "")
  const [search, setSearch] = useState("")
  const [modelSearch, setModelSearch] = useState("")
  const [yearFrom, setYearFrom] = useState(searchParams.get("yearFrom") || "")
  const [yearTo, setYearTo] = useState(searchParams.get("yearTo") || "")
  const [priceRange, setPriceRange] = useState(searchParams.get("priceRange") || "")
  const [transmission, setTransmission] = useState(searchParams.get("transmission") || "")
  const [fuelType, setFuelType] = useState(searchParams.get("fuelType") || "")
  const [mileageFrom, setMileageFrom] = useState(searchParams.get("mileageFrom") || "")
  const [mileageTo, setMileageTo] = useState(searchParams.get("mileageTo") || "")
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "")

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const data = await getCarMakes()
        setMakes(data)
      } catch (error) {
        console.error("Failed to fetch car makes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMakes()
  }, [])

  useEffect(() => {
    const fetchModels = async () => {
      if (!value) {
        setModels([])
        setModelValue("")
        return
      }

      setModelLoading(true)
      try {
        const data = await getCarModels(value)
        setModels(data)
        // Reset model value when make changes
        setModelValue("")
      } catch (error) {
        console.error("Failed to fetch car models:", error)
      } finally {
        setModelLoading(false)
      }
    }

    fetchModels()
  }, [value])

  const filteredMakes = makes.filter((make) =>
    make.name.toLowerCase().includes(search.toLowerCase())
  )

  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(modelSearch.toLowerCase())
  )

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Clear all existing params except view
    Array.from(params.keys()).forEach(key => {
      if (key !== "view") params.delete(key)
    })

    // Set new filter values if they exist
    if (value) params.set("make", value)
    if (modelValue) params.set("model", modelValue)
    if (yearFrom) params.set("yearFrom", yearFrom)
    if (yearTo) params.set("yearTo", yearTo)
    if (priceRange) params.set("priceRange", priceRange)
    if (transmission) params.set("transmission", transmission)
    if (fuelType) params.set("fuelType", fuelType)
    if (mileageFrom) params.set("mileageFrom", mileageFrom)
    if (mileageTo) params.set("mileageTo", mileageTo)
    if (keyword) params.set("keyword", keyword)

    router.push(`/cars?${params.toString()}`)
  }

  const handleReset = () => {
    setValue("")
    setModelValue("")
    setYearFrom("")
    setYearTo("")
    setPriceRange("")
    setTransmission("")
    setFuelType("")
    setMileageFrom("")
    setMileageTo("")
    setKeyword("")
    setSearch("")
    setModelSearch("")
    
    const params = new URLSearchParams()
    if (searchParams.get("view")) {
      params.set("view", searchParams.get("view")!)
    }
    router.push(`/cars?${params.toString()}`)
  }

  return (
    <Card className="mb-10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Find Your Perfect Car</CardTitle>
        <Button 
          variant="ghost" 
          onClick={handleReset}
          className="text-muted-foreground hover:text-foreground"
        >
          Reset filters
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main filters */}
        <div className="space-y-4">
          {/* Make and Model selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                  disabled={loading}
                >
                  {value
                    ? makes.find((make) => make.id === value)?.name
                    : loading 
                      ? "Loading makes..."
                      : "Select make..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Input
                  placeholder="Search make..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border-0 focus-visible:ring-0"
                />
                <div className="max-h-[300px] overflow-y-auto">
                  {filteredMakes.map((make) => (
                    <div
                      key={make.id}
                      className={cn(
                        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                        value === make.id && "bg-accent text-accent-foreground"
                      )}
                      onClick={() => {
                        setValue(value === make.id ? "" : make.id)
                        setOpen(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", value === make.id ? "opacity-100" : "opacity-0")} />
                      {make.name}
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Popover open={modelOpen} onOpenChange={setModelOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={modelOpen}
                  className="w-full justify-between"
                  disabled={!value || modelLoading}
                >
                  {modelValue
                    ? models.find((model) => model.id === modelValue)?.name
                    : !value
                      ? "Select make first"
                      : modelLoading
                        ? "Loading models..."
                        : "Select model..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Input
                  placeholder="Search model..."
                  value={modelSearch}
                  onChange={(e) => setModelSearch(e.target.value)}
                  className="border-0 focus-visible:ring-0"
                />
                <div className="max-h-[300px] overflow-y-auto">
                  {filteredModels.map((model) => (
                    <div
                      key={model.id}
                      className={cn(
                        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                        modelValue === model.id && "bg-accent text-accent-foreground"
                      )}
                      onClick={() => {
                        setModelValue(modelValue === model.id ? "" : model.id)
                        setModelOpen(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", modelValue === model.id ? "opacity-100" : "opacity-0")} />
                      {model.name}
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Secondary filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={yearFrom} onValueChange={setYearFrom}>
              <SelectTrigger>
                <SelectValue placeholder="Year From" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={fuelType} onValueChange={setFuelType}>
              <SelectTrigger>
                <SelectValue placeholder="Fuel Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gasoline">Gasoline</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-50000">0 - 50,000 zł</SelectItem>
                <SelectItem value="50000-100000">50,000 - 100,000 zł</SelectItem>
                <SelectItem value="100000-200000">100,000 - 200,000 zł</SelectItem>
                <SelectItem value="200000-500000">200,000 - 500,000 zł</SelectItem>
                <SelectItem value="500000+">500,000+ zł</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action buttons */}
          <div className="space-y-2">
            <Button className="w-full" onClick={handleSearch}>
              Search
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? "Hide" : "Show"} Advanced Filters
              {showAdvanced ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </Button>
          </div>

          {/* Advanced filters */}
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select value={yearTo} onValueChange={setYearTo}>
                <SelectTrigger>
                  <SelectValue placeholder="Year To" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={transmission} onValueChange={setTransmission}>
                <SelectTrigger>
                  <SelectValue placeholder="Transmission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automatic">Automatic</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>

              <Select value={mileageFrom} onValueChange={setMileageFrom}>
                <SelectTrigger>
                  <SelectValue placeholder="Mileage From" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 km</SelectItem>
                  <SelectItem value="10000">10,000 km</SelectItem>
                  <SelectItem value="50000">50,000 km</SelectItem>
                  <SelectItem value="100000">100,000 km</SelectItem>
                  <SelectItem value="150000">150,000 km</SelectItem>
                </SelectContent>
              </Select>

              <Select value={mileageTo} onValueChange={setMileageTo}>
                <SelectTrigger>
                  <SelectValue placeholder="Mileage To" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10000">10,000 km</SelectItem>
                  <SelectItem value="50000">50,000 km</SelectItem>
                  <SelectItem value="100000">100,000 km</SelectItem>
                  <SelectItem value="150000">150,000 km</SelectItem>
                  <SelectItem value="200000">200,000+ km</SelectItem>
                </SelectContent>
              </Select>

              <div className="md:col-span-2 lg:col-span-4">
                <Input 
                  placeholder="Search by keyword..." 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 