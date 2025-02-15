import { z } from 'zod'

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string()
    .url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL')
    .startsWith('https://', 'NEXT_PUBLIC_SUPABASE_URL must use HTTPS'),
  
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string()
    .min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
    .regex(
      /^[A-Za-z0-9-_\.]+$/,
      'NEXT_PUBLIC_SUPABASE_ANON_KEY must be a valid JWT token'
    ),
  
  SUPABASE_SERVICE_ROLE_KEY: z.string()
    .min(1, 'SUPABASE_SERVICE_ROLE_KEY is required')
    .regex(
      /^[A-Za-z0-9-_\.]+$/,
      'SUPABASE_SERVICE_ROLE_KEY must be a valid JWT token'
    ),
  
  // Clerk
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string()
    .min(1, 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required')
    .startsWith('pk_test_', 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY must start with pk_test_'),
  
  CLERK_SECRET_KEY: z.string()
    .min(1, 'CLERK_SECRET_KEY is required')
    .startsWith('sk_test_', 'CLERK_SECRET_KEY must start with sk_test_'),

  // Optional: Application URL (used for CORS)
  NEXT_PUBLIC_URL: z.string()
    .url('NEXT_PUBLIC_URL must be a valid URL')
    .startsWith('https://', 'NEXT_PUBLIC_URL must use HTTPS')
    .optional(),
})

export type Env = z.infer<typeof envSchema>

function validateEnv() {
  try {
    const parsed = envSchema.safeParse(process.env)
    
    if (!parsed.success) {
      const { fieldErrors } = parsed.error.flatten()
      const errorMessages = Object.entries(fieldErrors)
        .map(([field, errors]) => `  ${field}: ${errors?.join(', ')}`)
        .join('\n')
      
      throw new Error(
        'Invalid environment variables:\n' +
        errorMessages + '\n\n' +
        'See .env.example for required variables.'
      )
    }

    return parsed.data
  } catch (error) {
    if (error instanceof Error) {
      console.error('\n❌ Environment validation failed:\n' + error.message)
    } else {
      console.error('\n❌ Unknown error validating environment variables')
    }
    process.exit(1)
  }
}

export const env = validateEnv() 