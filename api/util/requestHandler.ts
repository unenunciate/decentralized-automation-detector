
import { ApiError } from '../errors/ApiError'
import { createError } from '../errors/createError'


export function requestHandler (method: 'GET'|'POST', fn: (request: any, response: any) => Promise<any>) {
  return async (request: any, response: any)  => {
    try {
      if (request.method !== method) {
        throw createError('method-not-allowed', { message: `Invalid method, expected ${method} got ${request.method}` })
      }

      const res = await fn(request, response)
      response.status(200).json(res)
    } catch (originalError: any) {
      // Handle the error
      let error: ApiError = originalError

      if (!(error instanceof ApiError)) {
        error = createError('server-error', {
          originalError,
        })
      }

      const {
        code, message, data, reason, statusCode,
      } = error?.toJSON() ?? {}

      if ((error.error?.statusCode && error.error?.statusCode >= 500) || error.error?.log) {
        Sentry.captureException(originalError instanceof Error ? originalError : error, {
          tags: {
            code,
            reason,
          },
          extra: {
            data,
            originalError: originalError?.stack,
          },
        })
        console.log('Error: ', error)
        console.log('Original Error: ', originalError)
      }

      // TODO: Notify Sentry
      const out = {
        error: {
          code,
          message,
          data,
          reason,
        },
      }

      response.status(statusCode ?? 500).json(out)
    }
  }
}