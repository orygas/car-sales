export interface Car {
  id: string
  // Basic Information
  make: string
  model: string
  year: number
  price: number
  condition: string
  mileage: number
  
  // Technical Details
  transmission: string
  fuel_type: string
  vin: string | null
  has_tuning: boolean
  
  // History & Status
  is_first_owner: boolean
  is_accident_free: boolean
  is_damaged: boolean
  is_serviced_at_dealer: boolean
  
  // Registration & Import
  is_registered: boolean
  registration_number: string
  first_registration_date: string
  show_registration_info: boolean
  is_imported: boolean
  import_country?: string
  
  // Other
  location: string
  description: string
  images: string[]
  seller_name: string
  seller_phone: string
} 