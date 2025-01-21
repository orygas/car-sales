"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, ControllerRenderProps } from "react-hook-form"
import { CarListing, carSchema, CarStep, carSteps } from "@/lib/schemas/car"
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
import { Plus, X, Check, ChevronsUpDown, Loader2 } from "lucide-react"
import Image from "next/image"
import { getCarMakes, getCarModels } from "@/lib/utils"
import { uploadCarImage } from "@/app/actions"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { memo } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { CarFormStepper } from "./car-form-stepper"

interface EUCountry {
  code: string;
  name: string;
}

const EU_COUNTRIES: EUCountry[] = [
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  { code: "BG", name: "Bulgaria" },
  { code: "HR", name: "Croatia" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" },
  { code: "EE", name: "Estonia" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "GR", name: "Greece" },
  { code: "HU", name: "Hungary" },
  { code: "IE", name: "Ireland" },
  { code: "IT", name: "Italy" },
  { code: "LV", name: "Latvia" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MT", name: "Malta" },
  { code: "NL", name: "Netherlands" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "RO", name: "Romania" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "ES", name: "Spain" },
  { code: "SE", name: "Sweden" }
];

type ImagePreview = {
  url: string;
  file: File;
}

type MakeSelectProps = {
  makes: Awaited<ReturnType<typeof getCarMakes>>;
  loading: boolean;
  makeSearch: string;
  setMakeSearch: (value: string) => void;
  openMake: boolean;
  setOpenMake: (value: boolean) => void;
  field: ControllerRenderProps<CarListing, "make">;
}

const MakeSelect = memo(({ makes, loading, makeSearch, setMakeSearch, openMake, setOpenMake, field }: MakeSelectProps) => {
  const filteredMakes = makes.filter((make) =>
    make.name.toLowerCase().includes(makeSearch.toLowerCase())
  )

  return (
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
  )
})
MakeSelect.displayName = "MakeSelect"

type ModelSelectProps = {
  models: Awaited<ReturnType<typeof getCarModels>>;
  loadingModels: boolean;
  hasMake: boolean;
  field: ControllerRenderProps<CarListing, "model">;
}

const ModelSelect = memo(({ models, loadingModels, hasMake, field }: ModelSelectProps) => {
  return (
    <Select
      disabled={!hasMake || loadingModels}
      onValueChange={field.onChange}
      value={field.value}
    >
      <FormControl>
        <SelectTrigger>
          <SelectValue 
            placeholder={
              loadingModels 
                ? "Loading models..." 
                : !hasMake
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
  )
})
ModelSelect.displayName = "ModelSelect"

type ImageUploadProps = {
  imagePreviews: ImagePreview[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
}

const ImageUpload = memo(({ imagePreviews, onUpload, onRemove }: ImageUploadProps) => {
  return (
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
            onClick={() => onRemove(index)}
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
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={onUpload}
            className="hidden"
            id="image-upload"
          />
        </div>
      )}
    </div>
  )
})
ImageUpload.displayName = "ImageUpload"

export function CarListingForm() {
  const [makes, setMakes] = React.useState<Awaited<ReturnType<typeof getCarMakes>>>([])
  const [models, setModels] = React.useState<Awaited<ReturnType<typeof getCarModels>>>([])
  const [loading, setLoading] = React.useState(true)
  const [loadingModels, setLoadingModels] = React.useState(false)
  const [openMake, setOpenMake] = React.useState(false)
  const [makeSearch, setMakeSearch] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const router = useRouter()

  const form = useForm<CarListing>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      description: "",
      condition: undefined,
      transmission: undefined,
      fuel_type: undefined,
      location: "",
      has_vin: false,
      vin: "",
      images: [],
      is_damaged: false,
      is_imported: false,
      import_country: "",
      is_first_owner: false,
      is_accident_free: false,
      is_registered: false,
      is_serviced_at_dealer: false,
      has_tuning: false,
      registration_number: "",
      first_registration_date: "",
      show_registration_info: false,
    }
  })

  const { setValue, watch } = form
  const selectedMake = watch("make")

  const [imagePreviews, setImagePreviews] = React.useState<ImagePreview[]>([])

  // Cleanup image URLs when component unmounts or previews change
  React.useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url))
    }
  }, [imagePreviews])

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
      if (!selectedMake) {
        setModels([])
        setValue("model", "")
        return
      }

      setLoadingModels(true)
      try {
        const data = await getCarModels(selectedMake)
        setModels(data)
        setValue("model", "")
      } catch (error) {
        console.error("Failed to fetch car models:", error)
      } finally {
        setLoadingModels(false)
      }
    }

    fetchModels()
  }, [selectedMake, setValue])

  const [currentStep, setCurrentStep] = React.useState<CarStep>(carSteps[0])
  const [completedSteps, setCompletedSteps] = React.useState<Set<string>>(new Set())

  // Save form state to localStorage when it changes
  React.useEffect(() => {
    const formData = form.getValues()
    localStorage.setItem('carFormData', JSON.stringify(formData))
    localStorage.setItem('carFormStep', currentStep.id)
    localStorage.setItem('carFormCompletedSteps', JSON.stringify(Array.from(completedSteps)))
  }, [form, currentStep.id, completedSteps])

  // Load saved form state on mount
  React.useEffect(() => {
    const savedFormData = localStorage.getItem('carFormData')
    const savedStep = localStorage.getItem('carFormStep')
    const savedCompletedSteps = localStorage.getItem('carFormCompletedSteps')

    if (savedFormData) {
      form.reset(JSON.parse(savedFormData))
    }
    if (savedStep) {
      const step = carSteps.find(s => s.id === savedStep)
      if (step) setCurrentStep(step)
    }
    if (savedCompletedSteps) {
      setCompletedSteps(new Set(JSON.parse(savedCompletedSteps)))
    }
  }, [])

  const onNext = async () => {
    const currentFields = currentStep.fields
    const result = await form.trigger(currentFields)
    
    if (result) {
      setCompletedSteps(prev => new Set([...prev, currentStep.id]))
      const nextStepIndex = carSteps.findIndex(step => step.id === currentStep.id) + 1
      if (nextStepIndex < carSteps.length) {
        setCurrentStep(carSteps[nextStepIndex])
      }
    }
  }

  const onBack = () => {
    const prevStepIndex = carSteps.findIndex(step => step.id === currentStep.id) - 1
    if (prevStepIndex >= 0) {
      setCurrentStep(carSteps[prevStepIndex])
    }
  }

  async function onSubmit(data: CarListing) {
    try {
      setSubmitting(true)
      console.log("Form data before submission:", data)

      // Upload images to Supabase storage
      const uploadPromises = imagePreviews.map(preview => uploadCarImage(preview.file))
      const uploadResults = await Promise.all(uploadPromises)

      const failedUploads = uploadResults.filter(result => 'error' in result)
      if (failedUploads.length > 0) {
        toast({
          title: "Error",
          description: "Failed to upload some images. Please try again.",
          variant: "destructive",
        })
        return
      }

      const imageUrls = uploadResults.map(result => (result as { url: string }).url)

      // Update the form data with the permanent image URLs and ensure all fields are properly set
      const formData = {
        ...data,
        images: imageUrls,
        vin: data.vin || null,
        condition: data.condition || "used",
        transmission: data.transmission || "manual",
        fuel_type: data.fuel_type || "gasoline",
        import_country: data.is_imported ? data.import_country : null,
        is_first_owner: data.is_first_owner || false,
        is_accident_free: data.is_accident_free || false,
        is_registered: data.is_registered || false,
        is_serviced_at_dealer: data.is_serviced_at_dealer || false,
        has_tuning: data.has_tuning || false,
        registration_number: data.is_registered ? data.registration_number : "",
        first_registration_date: data.is_registered ? data.first_registration_date : "",
        show_registration_info: data.show_registration_info || false,
      }

      console.log("Form data after processing:", formData)

      const response = await fetch("/api/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create listing")
      }

      const result = await response.json()
      toast({
        title: "Success",
        description: "Your car listing has been created.",
      })
      router.push(`/cars/${result.id}`)
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create listing",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (imagePreviews.length + files.length > 20) {
      toast({
        title: "Error",
        description: "You can upload a maximum of 20 images",
        variant: "destructive",
      })
      return
    }
    const newPreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      file: file
    }))
    setImagePreviews(prev => [...prev, ...newPreviews])
    setValue('images', [...(watch('images') || []), ...newPreviews.map(p => p.url)])
  }

  const handleRemoveImage = (index: number) => {
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index].url)
      return prev.filter((_, i) => i !== index)
    })
    const currentImages = watch('images') || []
    setValue('images', currentImages.filter((_, i) => i !== index))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[300px,1fr]">
      <div className="hidden lg:block">
        <Card className="p-6">
          <CarFormStepper
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            completedSteps={completedSteps}
            form={form}
          />
        </Card>
      </div>
    <Card>
      <CardHeader>
          <CardTitle>{currentStep.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {currentStep.description}
          </p>
      </CardHeader>
        <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-6">
                {currentStep.fields.map((field, index) => (
                  <div key={`${field}-${index}`}>
                    {/* Render form fields based on current step */}
                    {(() => {
                      switch (field) {
                        case "make":
                          return (
                            <FormField
                              control={form.control}
                              name={field}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Make</FormLabel>
                                  <MakeSelect
                                    makes={makes}
                                    loading={loading}
                                    makeSearch={makeSearch}
                                    setMakeSearch={setMakeSearch}
                                    openMake={openMake}
                                    setOpenMake={setOpenMake}
                                    field={field}
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )
                        case "model":
                          return (
                            <FormField
                              control={form.control}
                              name={field}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Model</FormLabel>
                                  <ModelSelect
                                    models={models}
                                    loadingModels={loadingModels}
                                    hasMake={!!selectedMake}
                                    field={field}
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )
                        case "year":
                          return (
                            <FormField
                              control={form.control}
                              name={field}
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
                          )
                        case "price":
                          return (
                            <FormField
                              control={form.control}
                              name={field}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Price (zł)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="Enter price in PLN"
                                      {...field}
                                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )
                        case "mileage":
                          return (
                            <FormField
                              control={form.control}
                              name={field}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Mileage (km)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="Enter mileage in kilometers"
                                      {...field}
                                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )
                        case "location":
                          return (
                            <FormField
                              control={form.control}
                              name={field}
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
                          )
                        case "vin":
                          return (
                            <FormField
                              control={form.control}
                              name={field}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>VIN (optional)</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter vehicle identification number"
                                      maxLength={17}
                                      {...field}
                                      value={field.value || ''}
                                      onChange={(e) => {
                                        const value = e.target.value.toUpperCase();
                                        if (value.length <= 17) {
                                          field.onChange(value || null);
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    The 17-character Vehicle Identification Number
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )
                        case "condition":
                          return (
                            <FormField
                              control={form.control}
                              name={field}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Condition</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select the condition of your vehicle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="new">New</SelectItem>
                                      <SelectItem value="used">Used</SelectItem>
                                      <SelectItem value="parts">For Parts</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )
                        case "transmission":
                          return (
                            <FormField
                              control={form.control}
                              name={field}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Transmission</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select the transmission type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="automatic">Automatic</SelectItem>
                                      <SelectItem value="manual">Manual</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )
                        case "fuel_type":
                          return (
                            <FormField
                              control={form.control}
                              name={field}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Fuel Type</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select the fuel type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="gasoline">Gasoline</SelectItem>
                                      <SelectItem value="diesel">Diesel</SelectItem>
                                      <SelectItem value="electric">Electric</SelectItem>
                                      <SelectItem value="hybrid">Hybrid</SelectItem>
                                      <SelectItem value="lpg">LPG</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )
                        case "description":
                          return (
                            <FormField
                              control={form.control}
                              name={field}
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
                          )
                        case "images":
                          return (
                            <FormField
                              control={form.control}
                              name={field}
                              render={() => (
                                <FormItem>
                                  <FormLabel>Images</FormLabel>
                                  <FormControl>
                                    <ImageUpload
                                      imagePreviews={imagePreviews}
                                      onUpload={handleImageUpload}
                                      onRemove={handleRemoveImage}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Upload up to 20 images of your car. First image will be the main image.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )
                        case "is_damaged":
                          return (
                            <FormField
                              control={form.control}
                              name={field}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Is the car damaged?</FormLabel>
                                  <div className="flex gap-4">
                                    <Button
                                      type="button"
                                      variant={field.value === true ? "default" : "outline"}
                                      onClick={() => field.onChange(true)}
                                    >
                                      Yes
                                    </Button>
                                    <Button
                                      type="button"
                                      variant={field.value === false ? "default" : "outline"}
                                      onClick={() => field.onChange(false)}
                                    >
                                      No
                                    </Button>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )
                        case "is_imported":
                          return (
                            <FormField
                              control={form.control}
                              name={field}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Is the car imported?</FormLabel>
                                  <div className="flex gap-4">
                                    <Button
                                      type="button"
                                      variant={field.value === true ? "default" : "outline"}
                                      onClick={() => field.onChange(true)}
                                    >
                                      Yes
                                    </Button>
                                    <Button
                                      type="button"
                                      variant={field.value === false ? "default" : "outline"}
                                      onClick={() => field.onChange(false)}
                                    >
                                      No
                                    </Button>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )
                        case "import_country":
                          return watch("is_imported") && (
                            <FormField
                              control={form.control}
                              name={field}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Import Country</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select country of import" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {EU_COUNTRIES.map(country => (
                                        <SelectItem key={country.code} value={country.name}>
                                          {country.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )
                        case "is_first_owner":
                          return (
                            <FormField
                              control={form.control}
                              name={field}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Are you the first owner?</FormLabel>
                                  <div className="flex gap-4">
                                    <Button
                                      type="button"
                                      variant={field.value === true ? "default" : "outline"}
                                      onClick={() => field.onChange(true)}
                                    >
                                      Yes
                                    </Button>
                                    <Button
                                      type="button"
                                      variant={field.value === false ? "default" : "outline"}
                                      onClick={() => field.onChange(false)}
                                    >
                                      No
                                    </Button>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )
                        case "is_accident_free":
                          return (
                            <FormField
                              control={form.control}
                              name={field}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Is the car accident free?</FormLabel>
                                  <div className="flex gap-4">
                                    <Button
                                      type="button"
                                      variant={field.value === true ? "default" : "outline"}
                                      onClick={() => field.onChange(true)}
                                    >
                                      Yes
                                    </Button>
                                    <Button
                                      type="button"
                                      variant={field.value === false ? "default" : "outline"}
                                      onClick={() => field.onChange(false)}
                                    >
                                      No
                                    </Button>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )
                        case "is_registered":
                          return (
                            <FormField
                              control={form.control}
                              name={field}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Is the car registered?</FormLabel>
                                  <div className="flex gap-4">
                                    <Button
                                      type="button"
                                      variant={field.value === true ? "default" : "outline"}
                                      onClick={() => field.onChange(true)}
                                    >
                                      Yes
                                    </Button>
                                    <Button
                                      type="button"
                                      variant={field.value === false ? "default" : "outline"}
                                      onClick={() => field.onChange(false)}
                                    >
                                      No
                                    </Button>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )
                        case "registration_number":
                          return watch("is_registered") && (
                            <FormField
                              control={form.control}
                              name={field}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Vehicle Registration Number</FormLabel>
                                  <Input 
                                    {...field} 
                                    placeholder="for example WA6642E"
                                    className={cn(
                                      "placeholder:text-muted-foreground",
                                      field.value ? "text-foreground" : "text-muted-foreground"
                                    )}
                                    value={field.value || ''}
                                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )
                        case "first_registration_date":
                          return watch("is_registered") && (
                            <FormField
                              control={form.control}
                              name={field}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Registration Date</FormLabel>
                                  <Input {...field} type="date" />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )
                        case "show_registration_info":
                          return (
                            <FormField
                              control={form.control}
                              name={field}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Show registration information in listing?</FormLabel>
                                  <div className="flex gap-4">
                                    <Button
                                      type="button"
                                      variant={field.value === true ? "default" : "outline"}
                                      onClick={() => field.onChange(true)}
                                    >
                                      Yes
                                    </Button>
                                    <Button
                                      type="button"
                                      variant={field.value === false ? "default" : "outline"}
                                      onClick={() => field.onChange(false)}
                                    >
                                      No
                                    </Button>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )
                        case "is_serviced_at_dealer":
                          return (
                            <FormField
                              control={form.control}
                              name={field}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Is the car serviced at licensed manufacturer services?</FormLabel>
                                  <div className="flex gap-4">
                                    <Button
                                      type="button"
                                      variant={field.value === true ? "default" : "outline"}
                                      onClick={() => field.onChange(true)}
                                    >
                                      Yes
                                    </Button>
                                    <Button
                                      type="button"
                                      variant={field.value === false ? "default" : "outline"}
                                      onClick={() => field.onChange(false)}
                                    >
                                      No
                                    </Button>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )
                        case "has_tuning":
                          return (
                            <FormField
                              control={form.control}
                              name={field}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Does the car have tuning?</FormLabel>
                                  <div className="flex gap-4">
                                    <Button
                                      type="button"
                                      variant={field.value === true ? "default" : "outline"}
                                      onClick={() => field.onChange(true)}
                                    >
                                      Yes
                                    </Button>
                                    <Button
                                      type="button"
                                      variant={field.value === false ? "default" : "outline"}
                                      onClick={() => field.onChange(false)}
                                    >
                                      No
                                    </Button>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )
                      }
                    })()}
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  disabled={carSteps[0].id === currentStep.id}
                >
                  Back
                </Button>
                {currentStep.id === carSteps[carSteps.length - 1].id ? (
                  <Button 
                    type="submit" 
                    disabled={submitting || !imagePreviews.length}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating listing...
                      </>
                    ) : (
                      "Create Listing"
                    )}
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    onClick={onNext}
                    disabled={currentStep.id === "images" && !imagePreviews.length}
                  >
                    {currentStep.id === "images" && !imagePreviews.length ? (
                      "Please add at least one image"
                    ) : (
                      "Next"
                    )}
                  </Button>
                )}
              </div>
          </form>
        </Form>
      </CardContent>
    </Card>
    </div>
  )
} 