import { Request, Response, NextFunction } from 'express'
import { HttpError } from '../core/response/httpError'
import { ErrorMessage, ErrorTitle, HttpStatusCode } from '../core/enums/response'
import * as jwt from 'jsonwebtoken'
import { handleError } from '../core/utils/errorHandler'
import { isTokenExpired } from '../core/utils/utils'

const envApiKey = process.env.API_SECRET_KEY
const jwtSecretToken = process.env.JWT_SECRET_ACCESS

export function integrationAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers.apikey
  try {
    if (!apiKey) {
      throw new HttpError(HttpStatusCode.UNAUTHORIZED, ErrorTitle.LACK_OF_CREDENTIALS, ErrorMessage.LACK_OF_CREDENTIALS)
    }

    if (apiKey != envApiKey) {
      throw new HttpError(HttpStatusCode.UNAUTHORIZED, ErrorTitle.INVALID_CREDENTIALS, ErrorMessage.INVALID_CREDENTIALS)
    }
    setTimeout(() => {
      next()
    }, 2000)
  } catch (error) {
    handleError(error, res)
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.headers.authorization
    console.log(accessToken)
    if (!accessToken) {
      throw new HttpError(
        HttpStatusCode.UNAUTHORIZED,
        ErrorTitle.AUTHENTICATION_ERROR,
        ErrorMessage.LACK_OF_CREDENTIALS
      )
    }

    // Validate secret token
    if (!jwtSecretToken) {
      throw new Error('JWT secret token is not configured properly in the environment variables.')
    }

    const decodedResult = jwt.verify(accessToken, jwtSecretToken) as jwt.JwtPayload

    // Check if renew token is expired
    if (isTokenExpired(decodedResult.exp)) {
      throw new HttpError(HttpStatusCode.UNAUTHORIZED, ErrorTitle.TOKEN_EXPIRED, ErrorMessage.TOKEN_EXPIRED)
    }

    req.body = {
      ...req.body,
      userId: decodedResult.userId,
      userRole: decodedResult.userRole,
    }
    next()

    // ...
  } catch (error) {
    handleError(error, res)
  }
}
