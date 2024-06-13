import { Response } from 'express'
import { HttpStatusCode, ErrorTitle, ErrorMessage } from '../enums/response'
import { HttpError } from '../response/httpError'

const handleError = (error: any, response: Response) => {
  if (error instanceof HttpError) {
    return response.status(error.statusCode).json({
      error: error.errorTitle,
      message: error.errorMessage,
      expiredAccessToken: error.expiredAccessToken,
      expiredRenewToken: error.expiredRenewToken,
    })
  } else {
    // Log the error
    console.error(error)
    return response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: ErrorTitle.INTERNAL_SERVER_ERROR,
      message: ErrorMessage.INTERNAL_SERVER_ERROR,
    })
  }
}

export { handleError }
