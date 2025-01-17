# Auto Market

A modern car marketplace built with Next.js, featuring authentication and real-time database functionality.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Authentication**: Clerk
- **Database**: Supabase
- **Language**: TypeScript

## Features

- Modern, responsive UI with dark/light mode support
- Authentication with Clerk (email, social logins)
- Car listings with image support
- Real-time database with Supabase
- Row Level Security (RLS) for data protection
- Form validation with React Hook Form and Zod
- Searchable dropdowns for car makes and models
- Optimized image handling

## API Routes

- `GET /api/cars` - List all cars with filtering options
- `POST /api/cars` - Create a new car listing (authenticated)
- `GET /api/cars/[id]` - Get a single car
- `PATCH /api/cars/[id]` - Update a car listing (owner only)
- `DELETE /api/cars/[id]` - Delete a car listing (owner only)

## Database Schema

### Cars Table
```sql
CREATE TABLE cars (
  id UUID PRIMARY KEY,
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Car Images Table
```sql
CREATE TABLE car_images (
  id UUID PRIMARY KEY,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - Reusable UI components
- `/lib` - Utility functions and configurations
- `/public` - Static assets
- `/supabase` - Database schema and configurations

## Security

- Row Level Security (RLS) policies ensure users can only:
  - View all car listings
  - Create their own listings
  - Edit/delete only their own listings
- Clerk handles authentication securely
- Environment variables for sensitive keys
- Type-safe database queries

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
