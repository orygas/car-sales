export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public data?: unknown,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }

  static BadRequest(message = 'Bad Request', data?: unknown, code = 'BAD_REQUEST') {
    return new ApiError(400, message, data, code)
  }

  static Unauthorized(message = 'Unauthorized', data?: unknown, code = 'UNAUTHORIZED') {
    return new ApiError(401, message, data, code)
  }

  static Forbidden(message = 'Forbidden', data?: unknown, code = 'FORBIDDEN') {
    return new ApiError(403, message, data, code)
  }

  static NotFound(message = 'Not Found', data?: unknown, code = 'NOT_FOUND') {
    return new ApiError(404, message, data, code)
  }

  static TooManyRequests(message = 'Too Many Requests', data?: unknown, code = 'RATE_LIMIT') {
    return new ApiError(429, message, data, code)
  }

  static InternalServer(message = 'Internal Server Error', data?: unknown, code = 'INTERNAL_ERROR') {
    return new ApiError(500, message, data, code)
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    // Log API errors with context
    console.error('API Error:', {
      code: error.code,
      status: error.statusCode,
      message: error.message,
      data: error.data,
    })

    return Response.json(
      {
        error: error.message,
        code: error.code,
        data: error.data,
      },
      { 
        status: error.statusCode,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }

  // Log unexpected errors
  console.error('Unhandled error:', error)
  
  return Response.json(
    {
      error: 'Internal Server Error',
      code: 'INTERNAL_ERROR',
    },
    { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    }
  )
} 