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

export function SearchBar() {
  const [makes, setMakes] = useState<CarMake[]>([])
  const [models, setModels] = useState<CarModel[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingModels, setLoadingModels] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [open, setOpen] = useState(false)
  const [openModel, setOpenModel] = useState(false)
  const [value, setValue] = useState("")
  const [modelValue, setModelValue] = useState("")
  const [search, setSearch] = useState("")
  const [modelSearch, setModelSearch] = useState("")
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

      setLoadingModels(true)
      setModelValue("")
      try {
        const data = await getCarModels(value)
        setModels(data.sort((a, b) => a.name.localeCompare(b.name)))
      } catch (error) {
        console.error("Failed to fetch car models:", error)
      } finally {
        setLoadingModels(false)
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

  return (
    <Card className="mb-10">
      <CardHeader>
        <CardTitle>Find Your Perfect Car</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loading}
                >
                  {value
                    ? makes.find((make) => make.id.toString() === value)?.name
                    : loading 
                      ? "Loading makes..."
                      : "Select make..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start" sideOffset={4}>
                <div className="flex flex-col">
                  <Input
                    placeholder="Search make..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-0 focus-visible:ring-0"
                  />
                  <div className="max-h-[300px] overflow-y-auto">
                    {filteredMakes.length === 0 ? (
                      <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none text-muted-foreground">
                        No make found.
                      </div>
                    ) : (
                      filteredMakes.map((make) => (
                        <div
                          key={make.id}
                          className={cn(
                            "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                            value === make.id.toString() && "bg-accent text-accent-foreground"
                          )}
                          onClick={() => {
                            setValue(value === make.id.toString() ? "" : make.id.toString())
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === make.id.toString() ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {make.name}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="md:col-span-1">
            <Popover open={openModel} onOpenChange={setOpenModel}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openModel}
                  className={cn(
                    "w-full justify-between h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    (!value || loadingModels) && "opacity-50 cursor-not-allowed pointer-events-none"
                  )}
                  disabled={!value || loadingModels}
                >
                  {modelValue
                    ? models.find((model) => model.id.toString() === modelValue)?.name
                    : loadingModels 
                      ? "Loading models..."
                      : !value
                        ? "Select make first"
                        : "Select model..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start" sideOffset={4}>
                <div className="flex flex-col">
                  <Input
                    placeholder="Search model..."
                    value={modelSearch}
                    onChange={(e) => setModelSearch(e.target.value)}
                    className="border-0 focus-visible:ring-0"
                  />
                  <div className="max-h-[300px] overflow-y-auto">
                    {filteredModels.length === 0 ? (
                      <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none text-muted-foreground">
                        No model found.
                      </div>
                    ) : (
                      filteredModels.map((model) => (
                        <div
                          key={model.id}
                          className={cn(
                            "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                            modelValue === model.id.toString() && "bg-accent text-accent-foreground"
                          )}
                          onClick={() => {
                            setModelValue(modelValue === model.id.toString() ? "" : model.id.toString())
                            setOpenModel(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              modelValue === model.id.toString() ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {model.name}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 col-span-2 gap-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Year From" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Body Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedan">Sedan</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="coupe">Coupe</SelectItem>
                <SelectItem value="truck">Truck</SelectItem>
                <SelectItem value="van">Van</SelectItem>
                <SelectItem value="wagon">Wagon</SelectItem>
                <SelectItem value="convertible">Convertible</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Fuel Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gasoline">Gasoline</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="plugin_hybrid">Plug-in Hybrid</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-10000">$0 - $10,000</SelectItem>
                <SelectItem value="10000-20000">$10,000 - $20,000</SelectItem>
                <SelectItem value="20000-30000">$20,000 - $30,000</SelectItem>
                <SelectItem value="30000-50000">$30,000 - $50,000</SelectItem>
                <SelectItem value="50000+">$50,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-4">
            <Button className="w-full">Search</Button>
          </div>
        </div>

        <div>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? "Hide" : "Show"} Advanced Filters
            {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Year To" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Transmission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automatic">Automatic</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="semi-automatic">Semi-Automatic</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Mileage From" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 miles</SelectItem>
                  <SelectItem value="10000">10,000 miles</SelectItem>
                  <SelectItem value="25000">25,000 miles</SelectItem>
                  <SelectItem value="50000">50,000 miles</SelectItem>
                  <SelectItem value="75000">75,000 miles</SelectItem>
                  <SelectItem value="100000">100,000 miles</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Mileage To" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10000">10,000 miles</SelectItem>
                  <SelectItem value="25000">25,000 miles</SelectItem>
                  <SelectItem value="50000">50,000 miles</SelectItem>
                  <SelectItem value="75000">75,000 miles</SelectItem>
                  <SelectItem value="100000">100,000 miles</SelectItem>
                  <SelectItem value="150000">150,000 miles</SelectItem>
                  <SelectItem value="200000">200,000+ miles</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="black">Black</SelectItem>
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="gray">Gray</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <div className="md:col-span-4">
                <Input placeholder="Search by keyword..." />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 