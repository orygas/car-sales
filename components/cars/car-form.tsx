"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { CarListing, carSchema } from "@/lib/schemas/car"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X, Check, ChevronsUpDown } from "lucide-react"
import Image from "next/image"
import { getCarMakes, getCarModels } from "@/lib/utils"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type ImagePreview = {
  url: string;
  file: File;
}

export function CarListingForm() {
  const [makes, setMakes] = React.useState<Awaited<ReturnType<typeof getCarMakes>>>([])
  const [models, setModels] = React.useState<Awaited<ReturnType<typeof getCarModels>>>([])
  const [loading, setLoading] = React.useState(true)
  const [loadingModels, setLoadingModels] = React.useState(false)
  const [openMake, setOpenMake] = React.useState(false)
  const [makeSearch, setMakeSearch] = React.useState("")

  const form = useForm<CarListing>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      description: "",
      condition: "Good",
      transmission: "Automatic",
      fuelType: "Gasoline",
      location: "",
      images: [],
    },
  })

  const [imagePreviews, setImagePreviews] = React.useState<ImagePreview[]>([])

  React.useEffect(() => {
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

  React.useEffect(() => {
    const fetchModels = async () => {
      const make = form.getValues("make")
      if (!make) {
        setModels([])
        form.setValue("model", "")
        return
      }

      setLoadingModels(true)
      try {
        const data = await getCarModels(make)
        setModels(data)
        // Clear model selection when make changes
        form.setValue("model", "")
      } catch (error) {
        console.error("Failed to fetch car models:", error)
      } finally {
        setLoadingModels(false)
      }
    }

    fetchModels()
  }, [form.watch("make")])

  function onSubmit(data: CarListing) {
    // TODO: Implement form submission
    console.log(data)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newPreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      file: file
    }))
    setImagePreviews(prev => [...prev, ...newPreviews])
    form.setValue('images', [...form.getValues('images'), ...files.map(file => URL.createObjectURL(file))])
  }

  const filteredMakes = makes.filter((make) =>
    make.name.toLowerCase().includes(makeSearch.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>List Your Car</CardTitle>
      </CardHeader>
      <CardContent className="">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Make</FormLabel>
                    <Popover open={openMake} onOpenChange={setOpenMake}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openMake}
                            className="w-full justify-between bg-background shadow-none border-input"
                            disabled={loading}
                          >
                            {field.value
                              ? makes.find((make) => make.id === field.value)?.name
                              : loading 
                                ? "Loading makes..."
                                : "Select make"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start" sideOffset={4}>
                        <div className="flex flex-col">
                          <Input
                            placeholder="Search make..."
                            value={makeSearch}
                            onChange={(e) => setMakeSearch(e.target.value)}
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
                                    field.value === make.id && "bg-accent text-accent-foreground"
                                  )}
                                  onClick={() => {
                                    field.onChange(make.id)
                                    setOpenMake(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === make.id ? "opacity-100" : "opacity-0"
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <Select
                      disabled={!form.getValues("make") || loadingModels}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue 
                            placeholder={
                              loadingModels 
                                ? "Loading models..." 
                                : !form.getValues("make")
                                  ? "Select make first"
                                  : "Select model"
                            } 
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {models.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Enter price"
                        {...field}
                        onChange={e => {
                          const value = e.target.value.replace(/[^0-9]/g, '')
                          field.onChange(value ? Number(value) : 0)
                        }}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mileage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mileage</FormLabel>
                    <FormControl>
                      <Input
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Enter mileage"
                        {...field}
                        onChange={e => {
                          const value = e.target.value.replace(/[^0-9]/g, '')
                          field.onChange(value ? Number(value) : 0)
                        }}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["New", "Like New", "Excellent", "Good", "Fair", "Poor"].map((condition) => (
                          <SelectItem key={condition} value={condition}>
                            {condition}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transmission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transmission</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select transmission" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["Automatic", "Manual", "Semi-Automatic"].map((transmission) => (
                          <SelectItem key={transmission} value={transmission}>
                            {transmission}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fuelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fuel Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          "Gasoline",
                          "Diesel",
                          "Electric",
                          "Hybrid",
                          "Plug-in Hybrid",
                        ].map((fuelType) => (
                          <SelectItem key={fuelType} value={fuelType}>
                            {fuelType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your car..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include important details about your cars features, history, and condition.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="images"
              render={() => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div
                          key={preview.url}
                          className="relative aspect-square rounded-lg border-2 border-muted overflow-hidden"
                        >
                          <Image
                            src={preview.url}
                            alt={`Car image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                            onClick={() => {
                              setImagePreviews(prev => prev.filter((_, i) => i !== index))
                              form.setValue('images', form.getValues('images').filter((_, i) => i !== index))
                            }}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      {imagePreviews.length < 8 && (
                        <div className="relative aspect-square rounded-md border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground">
                          <label
                            htmlFor="image-upload"
                            className="absolute inset-0 flex items-center justify-center cursor-pointer"
                          >
                            <Plus className="h-8 w-8 text-muted-foreground" />
                            <span className="sr-only">Upload image</span>
                          </label>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload up to 8 images of your car. First image will be the main image.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              List Your Car
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 