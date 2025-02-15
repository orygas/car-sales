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
import { ChevronDown, ChevronUp, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"
import { useCarSearch } from "@/hooks/use-car-search"

export function SearchBar() {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [open, setOpen] = useState(false)
  const [modelOpen, setModelOpen] = useState(false)

  const {
    makes,
    models,
    loading,
    modelLoading,
    value,
    modelValue,
    search,
    modelSearch,
    yearFrom,
    yearTo,
    priceRange,
    transmission,
    fuelType,
    mileageFrom,
    mileageTo,
    keyword,
    filteredMakes,
    filteredModels,
    setValue,
    setModelValue,
    setSearch,
    setModelSearch,
    setYearFrom,
    setYearTo,
    setPriceRange,
    setTransmission,
    setFuelType,
    setMileageFrom,
    setMileageTo,
    setKeyword,
    handleSearch,
    handleReset,
  } = useCarSearch()

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

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

          {/* Advanced filters */}
          <div className="space-y-4">
            <Button
              variant="ghost"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full justify-between"
            >
              Advanced filters
              {showAdvanced ? (
                <ChevronUp className="ml-2 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-2 h-4 w-4" />
              )}
            </Button>

            {showAdvanced && (
              <div className="space-y-4">
                {/* Year range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select value={yearFrom} onValueChange={setYearFrom}>
                    <SelectTrigger>
                      <SelectValue placeholder="Year from" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={yearTo} onValueChange={setYearTo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Year to" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price range */}
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-5000">Under $5,000</SelectItem>
                    <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                    <SelectItem value="10000-20000">$10,000 - $20,000</SelectItem>
                    <SelectItem value="20000-30000">$20,000 - $30,000</SelectItem>
                    <SelectItem value="30000-50000">$30,000 - $50,000</SelectItem>
                    <SelectItem value="50000+">Over $50,000</SelectItem>
                  </SelectContent>
                </Select>

                {/* Transmission */}
                <Select value={transmission} onValueChange={setTransmission}>
                  <SelectTrigger>
                    <SelectValue placeholder="Transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automatic">Automatic</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>

                {/* Fuel type */}
                <Select value={fuelType} onValueChange={setFuelType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                  </SelectContent>
                </Select>

                {/* Mileage range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Mileage from"
                    value={mileageFrom}
                    onChange={(e) => setMileageFrom(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Mileage to"
                    value={mileageTo}
                    onChange={(e) => setMileageTo(e.target.value)}
                  />
                </div>

                {/* Keyword search */}
                <Input
                  placeholder="Search by keyword..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            )}
          </div>

          <Button onClick={handleSearch} className="w-full">
            Search
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 