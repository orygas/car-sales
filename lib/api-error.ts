export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }

  static BadRequest(message = 'Bad Request', data?: unknown) {
    return new ApiError(400, message, data)
  }

  static Unauthorized(message = 'Unauthorized', data?: unknown) {
    return new ApiError(401, message, data)
  }

  static Forbidden(message = 'Forbidden', data?: unknown) {
    return new ApiError(403, message, data)
  }

  static NotFound(message = 'Not Found', data?: unknown) {
    return new ApiError(404, message, data)
  }

  static TooManyRequests(message = 'Too Many Requests', data?: unknown) {
    return new ApiError(429, message, data)
  }

  static InternalServer(message = 'Internal Server Error', data?: unknown) {
    return new ApiError(500, message, data)
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return Response.json(
      {
        error: error.message,
        data: error.data,
      },
      { status: error.statusCode }
    )
  }

  console.error('Unhandled error:', error)
  
  return Response.json(
    {
      error: 'Internal Server Error',
    },
    { status: 500 }
  )
} 