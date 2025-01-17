-- Create tables
CREATE TABLE cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  mileage INTEGER NOT NULL,
  description TEXT NOT NULL,
  condition TEXT NOT NULL,
  transmission TEXT NOT NULL,
  fuel_type TEXT NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create table for car images
CREATE TABLE car_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX cars_user_id_idx ON cars(user_id);
CREATE INDEX cars_make_model_idx ON cars(make, model);
CREATE INDEX cars_price_idx ON cars(price);
CREATE INDEX cars_created_at_idx ON cars(created_at);

-- Enable Row Level Security
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_images ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public cars are viewable by everyone"
  ON cars FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own cars"
  ON cars FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own cars"
  ON cars FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own cars"
  ON cars FOR DELETE
  USING (auth.uid()::text = user_id);

-- Image policies
CREATE POLICY "Public images are viewable by everyone"
  ON car_images FOR SELECT
  USING (true);

CREATE POLICY "Users can insert images for their own cars"
  ON car_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cars
      WHERE id = car_images.car_id
      AND user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can delete images for their own cars"
  ON car_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM cars
      WHERE id = car_images.car_id
      AND user_id = auth.uid()::text
    )
  ); 