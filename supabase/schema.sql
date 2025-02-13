-- Create a table for car listings
CREATE TABLE cars (
  -- Primary key and timestamps
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  user_id TEXT NOT NULL,

  -- Basic vehicle information
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM NOW()) + 1),
  price INTEGER NOT NULL CHECK (price > 0),
  mileage INTEGER NOT NULL CHECK (mileage > 0),
  description TEXT NOT NULL CHECK (length(description) >= 50 AND length(description) <= 6000),
  location TEXT NOT NULL,
  
  -- Vehicle specifications
  condition TEXT NOT NULL CHECK (condition IN ('new', 'used', 'parts')),
  transmission TEXT NOT NULL CHECK (transmission IN ('manual', 'automatic')),
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('gasoline', 'diesel', 'electric', 'hybrid', 'lpg', 'other')),
  
  -- VIN information
  has_vin BOOLEAN NOT NULL DEFAULT false,
  vin TEXT CHECK (vin IS NULL OR length(vin) = 17),
  
  -- Vehicle status and history
  is_damaged BOOLEAN NOT NULL DEFAULT false,
  is_imported BOOLEAN NOT NULL DEFAULT false,
  import_country TEXT CHECK (is_imported = false OR import_country IS NOT NULL),
  is_first_owner BOOLEAN NOT NULL DEFAULT false,
  is_accident_free BOOLEAN NOT NULL DEFAULT false,
  is_registered BOOLEAN NOT NULL DEFAULT false,
  is_serviced_at_dealer BOOLEAN NOT NULL DEFAULT false,
  has_tuning BOOLEAN NOT NULL DEFAULT false,
  
  -- Registration information
  registration_number TEXT DEFAULT '',
  first_registration_date TEXT DEFAULT '',
  show_registration_info BOOLEAN NOT NULL DEFAULT false,

  -- Seller information
  seller_name TEXT NOT NULL,
  seller_phone TEXT NOT NULL,

  -- Images array to store Supabase Storage URLs
  images TEXT[] NOT NULL DEFAULT '{}',

  -- Add constraints for registration information
  CONSTRAINT registration_info_check CHECK (
    NOT is_registered OR (
      registration_number != '' AND
      first_registration_date != ''
    )
  )
);

-- Create indexes for better query performance
CREATE INDEX idx_cars_user_id ON cars(user_id);
CREATE INDEX idx_cars_make_model ON cars(make, model);
CREATE INDEX idx_cars_price ON cars(price);
CREATE INDEX idx_cars_year ON cars(year);
CREATE INDEX idx_cars_created_at ON cars(created_at DESC);
CREATE INDEX idx_cars_location ON cars(location);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at timestamp
CREATE TRIGGER update_cars_updated_at
  BEFORE UPDATE ON cars
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security (RLS)
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Create policies for cars table
CREATE POLICY "Allow public read access" ON cars
  FOR SELECT USING (true);

-- Since we're using Clerk, we'll handle authentication in our API routes
CREATE POLICY "Allow all operations" ON cars
  FOR ALL USING (true);

-- Update the VIN column to be optional text with length check
ALTER TABLE cars 
  ALTER COLUMN vin TYPE TEXT,
  ALTER COLUMN vin DROP NOT NULL,
  DROP CONSTRAINT IF EXISTS cars_vin_check,
  ADD CONSTRAINT cars_vin_check CHECK (vin IS NULL OR length(vin) = 17);

-- Update the has_vin column
ALTER TABLE cars
  ALTER COLUMN has_vin SET DEFAULT false; 