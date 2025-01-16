# Auto Market

A modern car marketplace built with Next.js, TypeScript, and Tailwind CSS. This project allows users to browse, search, and list cars for sale with a clean and responsive user interface.

## Tech Stack

- **Framework**: Next.js 15.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Theme**: Dark/Light mode support
- **Database**: MongoDB (configured)
- **Form Handling**: React Hook Form with Zod validation

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env` file in the root directory with your MongoDB connection string:

```bash
DATABASE_URL="your_mongodb_connection_string"
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Current Features

- 🎨 Responsive layout with mobile-first design
- 🌓 Dark/Light theme support with system preference detection
- 🚗 Featured car listings section
- 🔍 Search functionality with make and price range filters
- 💅 Modern UI components using shadcn/ui
- 📱 Mobile-friendly navigation
- 🎨 Custom font integration (Geist)

## Project Structure

```text
├── app/                  # Next.js app directory
├── components/          # React components
│   ├── cars/           # Car-related components
│   ├── layout/         # Layout components
│   └── ui/             # UI components
├── lib/                # Utility functions and configurations
└── public/            # Static assets
```

## TODOs

### High Priority

- [ ] Implement authentication system
- [ ] Create car listing form
- [ ] Set up MongoDB models for cars and users
- [ ] Add API routes for CRUD operations
- [ ] Implement image upload functionality

### Medium Priority

- [ ] Add pagination to car listings
- [ ] Implement advanced search filters
- [ ] Add user dashboard
- [ ] Create favorite/save listing functionality
- [ ] Add sorting options for search results

### Low Priority

- [ ] Add more language options
- [ ] Implement email notifications
- [ ] Add social sharing features
- [ ] Create car comparison tool
- [ ] Add analytics tracking

## Development Notes

- The project uses Turbopack for faster development builds
- Custom theme configuration is available in `globals.css`
- Component library is built on top of Radix UI primitives
- MongoDB connection is configured for both development and production environments

## Deployment

The project is configured for deployment on Vercel. For other platforms, please refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
