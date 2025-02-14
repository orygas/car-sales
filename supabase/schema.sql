-- Create tables for car makes and models
CREATE TABLE car_makes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE car_models (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  make_id TEXT NOT NULL REFERENCES car_makes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (id, make_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_car_models_make_id ON car_models(make_id);

-- Populate car makes
INSERT INTO car_makes (id, name) VALUES
('audi', 'Audi'),
('bmw', 'BMW'),
('mercedes-benz', 'Mercedes-Benz'),
('volkswagen', 'Volkswagen'),
('porsche', 'Porsche'),
('volvo', 'Volvo'),
('ferrari', 'Ferrari'),
('lamborghini', 'Lamborghini'),
('maserati', 'Maserati'),
('alfa-romeo', 'Alfa Romeo'),
('bentley', 'Bentley'),
('bugatti', 'Bugatti'),
('jaguar', 'Jaguar'),
('land-rover', 'Land Rover'),
('mini', 'MINI'),
('rolls-royce', 'Rolls-Royce'),
('peugeot', 'Peugeot'),
('renault', 'Renault'),
('citroen', 'Citroën'),
('ds', 'DS'),
('fiat', 'Fiat'),
('seat', 'SEAT'),
('skoda', 'Škoda'),
('smart', 'Smart'),
('opel', 'Opel'),
('vauxhall', 'Vauxhall'),
('toyota', 'Toyota'),
('honda', 'Honda'),
('ford', 'Ford'),
('tesla', 'Tesla');

-- Populate car models
INSERT INTO car_models (id, name, make_id) VALUES
-- Audi models
('a1', 'A1', 'audi'),
('a3', 'A3', 'audi'),
('a4', 'A4', 'audi'),
('a5', 'A5', 'audi'),
('a6', 'A6', 'audi'),
('a7', 'A7', 'audi'),
('a8', 'A8', 'audi'),
('e-tron', 'e-tron', 'audi'),
('q2', 'Q2', 'audi'),
('q3', 'Q3', 'audi'),
('q5', 'Q5', 'audi'),
('q7', 'Q7', 'audi'),
('q8', 'Q8', 'audi'),
('r8', 'R8', 'audi'),
('rs3', 'RS3', 'audi'),
('rs4', 'RS4', 'audi'),
('rs5', 'RS5', 'audi'),
('rs6', 'RS6', 'audi'),
('rs7', 'RS7', 'audi'),
('tt', 'TT', 'audi'),

-- BMW models
('1-series', '1 Series', 'bmw'),
('2-series', '2 Series', 'bmw'),
('3-series', '3 Series', 'bmw'),
('4-series', '4 Series', 'bmw'),
('5-series', '5 Series', 'bmw'),
('6-series', '6 Series', 'bmw'),
('7-series', '7 Series', 'bmw'),
('8-series', '8 Series', 'bmw'),
('i3', 'i3', 'bmw'),
('i4', 'i4', 'bmw'),
('i8', 'i8', 'bmw'),
('ix', 'iX', 'bmw'),
('m2', 'M2', 'bmw'),
('m3', 'M3', 'bmw'),
('m4', 'M4', 'bmw'),
('m5', 'M5', 'bmw'),
('m8', 'M8', 'bmw'),
('x1', 'X1', 'bmw'),
('x2', 'X2', 'bmw'),
('x3', 'X3', 'bmw'),
('x4', 'X4', 'bmw'),
('x5', 'X5', 'bmw'),
('x6', 'X6', 'bmw'),
('x7', 'X7', 'bmw'),
('z4', 'Z4', 'bmw'),

-- Mercedes-Benz models
('a-class', 'A-Class', 'mercedes-benz'),
('amg-gt', 'AMG GT', 'mercedes-benz'),
('b-class', 'B-Class', 'mercedes-benz'),
('c-class', 'C-Class', 'mercedes-benz'),
('cls', 'CLS', 'mercedes-benz'),
('e-class', 'E-Class', 'mercedes-benz'),
('eqc', 'EQC', 'mercedes-benz'),
('eqs', 'EQS', 'mercedes-benz'),
('gla', 'GLA', 'mercedes-benz'),
('glb', 'GLB', 'mercedes-benz'),
('glc', 'GLC', 'mercedes-benz'),
('gle', 'GLE', 'mercedes-benz'),
('gls', 'GLS', 'mercedes-benz'),
('s-class', 'S-Class', 'mercedes-benz'),
('sl', 'SL', 'mercedes-benz'),

-- Volkswagen models
('arteon', 'Arteon', 'volkswagen'),
('golf', 'Golf', 'volkswagen'),
('id3', 'ID.3', 'volkswagen'),
('id4', 'ID.4', 'volkswagen'),
('id5', 'ID.5', 'volkswagen'),
('passat', 'Passat', 'volkswagen'),
('polo', 'Polo', 'volkswagen'),
('t-cross', 'T-Cross', 'volkswagen'),
('t-roc', 'T-Roc', 'volkswagen'),
('taigo', 'Taigo', 'volkswagen'),
('tiguan', 'Tiguan', 'volkswagen'),
('touareg', 'Touareg', 'volkswagen'),

-- Porsche models
('718-boxster', '718 Boxster', 'porsche'),
('718-cayman', '718 Cayman', 'porsche'),
('911', '911', 'porsche'),
('cayenne', 'Cayenne', 'porsche'),
('macan', 'Macan', 'porsche'),
('panamera', 'Panamera', 'porsche'),
('taycan', 'Taycan', 'porsche'),

-- Volvo models
('c40', 'C40', 'volvo'),
('s60', 'S60', 'volvo'),
('s90', 'S90', 'volvo'),
('v60', 'V60', 'volvo'),
('v90', 'V90', 'volvo'),
('xc40', 'XC40', 'volvo'),
('xc60', 'XC60', 'volvo'),
('xc90', 'XC90', 'volvo'),

-- Ferrari models
('296', '296', 'ferrari'),
('812', '812', 'ferrari'),
('f8', 'F8', 'ferrari'),
('portofino', 'Portofino', 'ferrari'),
('purosangue', 'Purosangue', 'ferrari'),
('roma', 'Roma', 'ferrari'),
('sf90', 'SF90', 'ferrari'),

-- Lamborghini models
('aventador', 'Aventador', 'lamborghini'),
('huracan', 'Huracán', 'lamborghini'),
('revuelto', 'Revuelto', 'lamborghini'),
('urus', 'Urus', 'lamborghini'),

-- Maserati models
('ghibli', 'Ghibli', 'maserati'),
('quattroporte', 'Quattroporte', 'maserati'),
('levante', 'Levante', 'maserati'),
('mc20', 'MC20', 'maserati'),
('grecale', 'Grecale', 'maserati'),

-- Alfa Romeo models
('giulia', 'Giulia', 'alfa-romeo'),
('stelvio', 'Stelvio', 'alfa-romeo'),
('tonale', 'Tonale', 'alfa-romeo'),

-- Jaguar models
('f-pace', 'F-PACE', 'jaguar'),
('e-pace', 'E-PACE', 'jaguar'),
('i-pace', 'I-PACE', 'jaguar'),
('f-type', 'F-TYPE', 'jaguar'),
('xe', 'XE', 'jaguar'),
('xf', 'XF', 'jaguar'),

-- Land Rover models
('range-rover', 'Range Rover', 'land-rover'),
('range-rover-sport', 'Range Rover Sport', 'land-rover'),
('range-rover-velar', 'Range Rover Velar', 'land-rover'),
('range-rover-evoque', 'Range Rover Evoque', 'land-rover'),
('discovery', 'Discovery', 'land-rover'),
('discovery-sport', 'Discovery Sport', 'land-rover'),
('defender', 'Defender', 'land-rover'),

-- Bentley models
('continental-gt', 'Continental GT', 'bentley'),
('flying-spur', 'Flying Spur', 'bentley'),
('bentayga', 'Bentayga', 'bentley'),

-- Rolls-Royce models
('phantom', 'Phantom', 'rolls-royce'),
('ghost', 'Ghost', 'rolls-royce'),
('cullinan', 'Cullinan', 'rolls-royce'),
('spectre', 'Spectre', 'rolls-royce'),

-- Peugeot models
('208', '208', 'peugeot'),
('2008', '2008', 'peugeot'),
('308', '308', 'peugeot'),
('3008', '3008', 'peugeot'),
('408', '408', 'peugeot'),
('508', '508', 'peugeot'),
('5008', '5008', 'peugeot'),

-- Renault models
('clio', 'Clio', 'renault'),
('captur', 'Captur', 'renault'),
('megane', 'Megane', 'renault'),
('arkana', 'Arkana', 'renault'),
('austral', 'Austral', 'renault'),
('espace', 'Espace', 'renault'),
('scenic', 'Scenic', 'renault'),

-- Citroen models
('c3', 'C3', 'citroen'),
('c4', 'C4', 'citroen'),
('c5-x', 'C5 X', 'citroen'),
('c5-aircross', 'C5 Aircross', 'citroen'),
('berlingo', 'Berlingo', 'citroen'),
('spacetourer', 'SpaceTourer', 'citroen'),

-- Skoda models
('fabia', 'Fabia', 'skoda'),
('octavia', 'Octavia', 'skoda'),
('superb', 'Superb', 'skoda'),
('kamiq', 'Kamiq', 'skoda'),
('karoq', 'Karoq', 'skoda'),
('kodiaq', 'Kodiaq', 'skoda'),
('enyaq', 'Enyaq', 'skoda'),
('scala', 'Scala', 'skoda'),

-- SEAT models
('ibiza', 'Ibiza', 'seat'),
('leon', 'Leon', 'seat'),
('arona', 'Arona', 'seat'),
('ateca', 'Ateca', 'seat'),
('tarraco', 'Tarraco', 'seat'),

-- Fiat models
('500', '500', 'fiat'),
('500x', '500X', 'fiat'),
('tipo', 'Tipo', 'fiat'),
('panda', 'Panda', 'fiat'),

-- MINI models
('3-door', '3-Door', 'mini'),
('5-door', '5-Door', 'mini'),
('clubman', 'Clubman', 'mini'),
('countryman', 'Countryman', 'mini'),
('convertible', 'Convertible', 'mini'),

-- Smart models
('fortwo', 'fortwo', 'smart'),
('1', '#1', 'smart'),
('3', '#3', 'smart'),

-- Opel models
('corsa', 'Corsa', 'opel'),
('astra', 'Astra', 'opel'),
('mokka', 'Mokka', 'opel'),
('crossland', 'Crossland', 'opel'),
('grandland', 'Grandland', 'opel'),

-- Vauxhall models
('vauxhall-corsa', 'Corsa', 'vauxhall'),
('vauxhall-astra', 'Astra', 'vauxhall'),
('vauxhall-mokka', 'Mokka', 'vauxhall'),
('vauxhall-crossland', 'Crossland', 'vauxhall'),
('vauxhall-grandland', 'Grandland', 'vauxhall'),

-- DS models
('ds-3', '3', 'ds'),
('ds-4', '4', 'ds'),
('ds-7', '7', 'ds'),
('ds-9', '9', 'ds'),

-- Bugatti models
('chiron', 'Chiron', 'bugatti'),
('mistral', 'Mistral', 'bugatti'),

-- Toyota models
('aygo', 'Aygo', 'toyota'),
('bz4x', 'bZ4X', 'toyota'),
('camry', 'Camry', 'toyota'),
('chr', 'C-HR', 'toyota'),
('corolla', 'Corolla', 'toyota'),
('gr86', 'GR86', 'toyota'),
('highlander', 'Highlander', 'toyota'),
('land-cruiser', 'Land Cruiser', 'toyota'),
('prius', 'Prius', 'toyota'),
('rav4', 'RAV4', 'toyota'),
('supra', 'Supra', 'toyota'),
('yaris', 'Yaris', 'toyota'),

-- Honda models
('accord', 'Accord', 'honda'),
('civic', 'Civic', 'honda'),
('cr-v', 'CR-V', 'honda'),
('hr-v', 'HR-V', 'honda'),
('jazz', 'Jazz', 'honda'),
('e', 'e', 'honda'),
('zr-v', 'ZR-V', 'honda'),
('nsx', 'NSX', 'honda'),

-- Ford models
('fiesta', 'Fiesta', 'ford'),
('focus', 'Focus', 'ford'),
('mustang', 'Mustang', 'ford'),
('kuga', 'Kuga', 'ford'),
('puma', 'Puma', 'ford'),
('ranger', 'Ranger', 'ford'),
('bronco', 'Bronco', 'ford'),
('explorer', 'Explorer', 'ford'),
('edge', 'Edge', 'ford'),
('ecosport', 'EcoSport', 'ford'),
('mondeo', 'Mondeo', 'ford'),
('f-150', 'F-150', 'ford'),
('transit', 'Transit', 'ford'),
('tourneo', 'Tourneo', 'ford'),
('s-max', 'S-MAX', 'ford'),
('galaxy', 'Galaxy', 'ford'),
('gt', 'GT', 'ford'),
('shelby-gt500', 'Shelby GT500', 'ford'),
('mach-e', 'Mustang Mach-E', 'ford'),

-- Tesla models
('model-3', 'Model 3', 'tesla'),
('model-s', 'Model S', 'tesla'),
('model-x', 'Model X', 'tesla'),
('model-y', 'Model Y', 'tesla'),
('cybertruck', 'Cybertruck', 'tesla'),
('roadster', 'Roadster', 'tesla');

-- Create a table for car listings
CREATE TABLE cars (
  -- Primary key and timestamps
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  user_id TEXT NOT NULL,

  -- Basic vehicle information
  make TEXT NOT NULL REFERENCES car_makes(id),
  model TEXT NOT NULL REFERENCES car_models(id),
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
  ),

  -- Add foreign key constraint to ensure model belongs to make
  FOREIGN KEY (model, make) REFERENCES car_models(id, make_id)
);

-- Create a table for user favorites
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  
  -- Ensure each car can only be favorited once per user
  UNIQUE(user_id, car_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_cars_user_id ON cars(user_id);
CREATE INDEX idx_cars_make_model ON cars(make, model);
CREATE INDEX idx_cars_price ON cars(price);
CREATE INDEX idx_cars_year ON cars(year);
CREATE INDEX idx_cars_created_at ON cars(created_at DESC);
CREATE INDEX idx_cars_location ON cars(location);
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_car_id ON user_favorites(car_id);

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
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for cars table
CREATE POLICY "Allow public read access" ON cars
  FOR SELECT USING (true);

-- Since we're using Clerk, we'll handle authentication in our API routes
CREATE POLICY "Allow all operations" ON cars
  FOR ALL USING (true);

-- Create policies for user_favorites table
CREATE POLICY "Allow all operations for user_favorites" ON user_favorites
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