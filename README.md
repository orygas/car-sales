# Auto Market (v1.1.0)

A modern, production-ready car marketplace built with Next.js 15, featuring secure authentication, real-time database functionality, and a responsive UI.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [Supabase](https://supabase.com/)
- **Language**: TypeScript
- **Deployment**: Netlify

## Core Features

- 🎨 Modern, responsive UI with dark/light mode
- 🔐 Secure authentication with Clerk
- 🛡️ Enhanced API security with route protection
- 📱 Mobile-first design approach
- 🖼️ Image upload and management
- 🔍 Advanced search and filtering
- ⚡ Real-time updates with Supabase
- 🛡️ Row Level Security (RLS)
- 📝 Form validation (React Hook Form + Zod)
- 🚗 Car make/model searchable dropdowns
- 🖥️ Grid/List view toggle
- ❤️ Favorite listings functionality
- 📊 User dashboard
- 🔒 Protected routes
- 🌐 SEO optimized with dynamic metadata
- 🎭 Server/Client component separation
- 🔄 Loading states and skeletons

## Security Features

- Row Level Security (RLS) policies
- Secure authentication with Clerk
- Protected API routes with method-based access control
- Type-safe database queries
- Environment variable validation
- Input validation and sanitization
- CORS and security headers
- API rate limiting

## Project Structure

```
.
├── app/                  # Next.js 15 app directory
│   ├── about/           # About page
│   ├── api/             # API routes
│   ├── cars/           # Car listings and details
│   ├── profile/        # User profile section
│   └── [...]/          # Other app routes
├── components/          # Reusable components
│   ├── auth/           # Authentication components
│   ├── cars/           # Car-related components
│   ├── layout/         # Layout components
│   ├── profile/        # Profile components
│   └── ui/             # UI components (shadcn/ui)
├── lib/                # Utilities and configurations
│   ├── schemas/        # Zod validation schemas
│   └── types/         # TypeScript types
├── public/             # Static assets
└── supabase/          # Database configuration
```

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

### User Favorites Table
```sql
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255) NOT NULL,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, car_id)
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
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=

   # Application URL (used for CORS)
   NEXT_PUBLIC_URL=
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Performance Optimizations

- Server/Client component separation
- Image optimization with Next.js Image
- Component-level code splitting
- Efficient data fetching with Supabase
- Responsive image loading
- Dynamic metadata generation
- Loading state skeletons
- Optimized build output

## Recent Updates (v1.1.0)

- Enhanced API security with method-based access control
- Improved Next.js 15 compatibility
- Server/Client component separation for better performance
- Dynamic metadata generation for better SEO
- Loading state improvements
- Security header enhancements
- Environment variable validation
- Type safety improvements

## License

This project is licensed under the MIT License.

## Version History

### v1.1.0
- Enhanced security features
- Next.js 15 compatibility updates
- Performance improvements
- Component architecture updates

### v1.0.0
- Initial production release
- Complete car marketplace functionality
- User authentication and profiles
- Real-time updates
- Mobile-responsive design
- Production-ready deployment
