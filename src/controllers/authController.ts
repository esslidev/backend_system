import { PrismaClient, User } from '@prisma/client'
import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { ErrorMessage, ErrorTitle, HttpStatusCode } from '../core/enums/response'
import { HttpError } from '../core/response/httpError'
import { handleError } from '../core/utils/errorHandler'
import {
  getJwtExpiryTime,
  isEmailValid,
  isPasswordValid,
  isTokenExpired,
  saltAndHashPassword,
  verifyPassword,
} from '../core/utils/utils'
import CustomResponse from '../core/response/apiResponse'
import { Console } from 'console'

const prisma = new PrismaClient()

const jwtSecretToken = process.env.JWT_SECRET_ACCESS
const jwtSecretRenewToken = process.env.JWT_SECRET_RENEW

const accessTokenLifeSpan = process.env.ACCESS_TOKEN_LIFESPAN
const renewTokenLifeSpan = process.env.RENEW_TOKEN_LIFESPAN

const signUp = async (req: Request, res: Response) => {
  const { email, password, thirdPartyProvider, thirdPartyId, thirdPartyAccessToken } = req.body

  try {
    // Check if user already exists
    let user: User | null = null
    if (email) {
      user = await prisma.user.findUnique({ where: { email } })
    } else if (thirdPartyProvider && thirdPartyId) {
      user = await prisma.user.findUnique({ where: { thirdPartyId } })
    }

    if (user) {
      throw new HttpError(HttpStatusCode.BAD_REQUEST, ErrorTitle.USER_ALREADY_EXISTS, ErrorMessage.USER_ALREADY_EXISTS)
    }

    // Perform email validation if provided
    if (email && !isEmailValid(email)) {
      throw new HttpError(HttpStatusCode.BAD_REQUEST, ErrorTitle.INVALID_EMAIL, ErrorMessage.INVALID_EMAIL)
    }

    // Perform password validation
    if (password && !isPasswordValid(password)) {
      throw new HttpError(HttpStatusCode.BAD_REQUEST, ErrorTitle.INVALID_PASSWORD, ErrorMessage.INVALID_PASSWORD)
    }

    if (thirdPartyProvider && thirdPartyId && thirdPartyAccessToken) {
      // Sign up with third-party provider
      user = await prisma.user.create({
        data: {
          thirdPartyId,
          thirdPartyProvider,
          thirdPartyAccessToken,
          email, // If available
          hashedPassword: null, // No password for third-party sign-up
        },
      })
    } else if (email && password) {
      // Sign up with email and password
      const hashedPassword = await saltAndHashPassword(password)
      user = await prisma.user.create({
        data: {
          email,
          hashedPassword: hashedPassword, // In a real-world scenario, you'd hash the password before storing it
        },
      })
    } else {
      throw new HttpError(HttpStatusCode.BAD_REQUEST, ErrorTitle.INVALID_SIGNUP_DATA, ErrorMessage.INVALID_SIGNUP_DATA)
    }

    if (!jwtSecretToken || !jwtSecretRenewToken) {
      throw new Error('JWT secret tokens are not configured properly in the environment variables.')
    }

    const tokenPayload = { userId: user.id, userRole: user.role }
    const finalAccessToken = jwt.sign(tokenPayload, jwtSecretToken, {
      expiresIn: getJwtExpiryTime(accessTokenLifeSpan),
    })
    const finalRenewToken = jwt.sign(tokenPayload, jwtSecretRenewToken, {
      expiresIn: getJwtExpiryTime(renewTokenLifeSpan),
    })

    new CustomResponse(res).send({ accessToken: finalAccessToken, renewToken: finalRenewToken })
  } catch (error) {
    handleError(error, res)
  }
}

const adminSignIn = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    // Perform email validation if provided
    if (email && !isEmailValid(email)) {
      throw new HttpError(HttpStatusCode.BAD_REQUEST, ErrorTitle.INVALID_EMAIL, ErrorMessage.INVALID_EMAIL)
    }
    // Perform password validation
    if (password && !isPasswordValid(password)) {
      throw new HttpError(HttpStatusCode.BAD_REQUEST, ErrorTitle.INVALID_PASSWORD, ErrorMessage.INVALID_PASSWORD)
    }

    let user: User | null = null

    if (email && password) {
      // Find user by email
      user = await prisma.user.findUnique({ where: { email, role: 'admin' } })
      if (user && !(await verifyPassword(password, user.hashedPassword))) {
        throw new HttpError(
          HttpStatusCode.UNAUTHORIZED,
          ErrorTitle.INVALID_CREDENTIALS,
          ErrorMessage.INVALID_CREDENTIALS
        )
      }
    }

    if (!user) {
      throw new HttpError(HttpStatusCode.UNAUTHORIZED, ErrorTitle.INVALID_SIGNIN_DATA, ErrorMessage.INVALID_SIGNIN_DATA)
    }

    if (!user.isValidated) {
      console.warn('user is not validated!!')
    }

    if (!jwtSecretToken || !jwtSecretRenewToken) {
      throw new Error('JWT secret tokens are not configured properly in the environment variables.')
    }
    const tokenPayload = { userId: user.id, userRole: user.role }
    const finalAccessToken = jwt.sign(tokenPayload, jwtSecretToken, {
      expiresIn: getJwtExpiryTime(accessTokenLifeSpan),
    })
    const finalRenewToken = jwt.sign(tokenPayload, jwtSecretRenewToken, {
      expiresIn: getJwtExpiryTime(renewTokenLifeSpan),
    })

    new CustomResponse(res).send({ accessToken: finalAccessToken, renewToken: finalRenewToken })
  } catch (error) {
    handleError(error, res)
  }
}

const signIn = async (req: Request, res: Response) => {
  const { email, password, thirdPartyProvider, thirdPartyId, thirdPartyAccessToken } = req.body
  try {
    // Perform email validation if provided
    if (email && !isEmailValid(email)) {
      throw new HttpError(HttpStatusCode.BAD_REQUEST, ErrorTitle.INVALID_EMAIL, ErrorMessage.INVALID_EMAIL)
    }
    // Perform password validation
    if (password && !isPasswordValid(password)) {
      throw new HttpError(HttpStatusCode.BAD_REQUEST, ErrorTitle.INVALID_PASSWORD, ErrorMessage.INVALID_PASSWORD)
    }

    let user: User | null = null

    if (thirdPartyProvider && thirdPartyId && thirdPartyAccessToken) {
      // Find user by thirdPartyId
      user = await prisma.user.findUnique({ where: { thirdPartyId, role: 'user' } })
      if (user && user.thirdPartyAccessToken !== thirdPartyAccessToken) {
        throw new HttpError(
          HttpStatusCode.UNAUTHORIZED,
          ErrorTitle.INVALID_CREDENTIALS,
          ErrorMessage.INVALID_CREDENTIALS
        )
      }
    } else if (email && password) {
      // Find user by email
      user = await prisma.user.findUnique({ where: { email, role: 'user' } })
      if (user && !(await verifyPassword(password, user.hashedPassword))) {
        throw new HttpError(
          HttpStatusCode.UNAUTHORIZED,
          ErrorTitle.INVALID_CREDENTIALS,
          ErrorMessage.INVALID_CREDENTIALS
        )
      }
    }

    if (!user) {
      throw new HttpError(HttpStatusCode.UNAUTHORIZED, ErrorTitle.INVALID_SIGNIN_DATA, ErrorMessage.INVALID_SIGNIN_DATA)
    }

    if (!user.isValidated) {
      console.warn('user is not validated!!')
    }

    if (!jwtSecretToken || !jwtSecretRenewToken) {
      throw new Error('JWT secret tokens are not configured properly in the environment variables.')
    }
    const tokenPayload = { userId: user.id, userRole: user.role }
    const finalAccessToken = jwt.sign(tokenPayload, jwtSecretToken, {
      expiresIn: getJwtExpiryTime(accessTokenLifeSpan),
    })
    const finalRenewToken = jwt.sign(tokenPayload, jwtSecretRenewToken, {
      expiresIn: getJwtExpiryTime(renewTokenLifeSpan),
    })

    new CustomResponse(res).send({ accessToken: finalAccessToken, renewToken: finalRenewToken })
  } catch (error) {
    handleError(error, res)
  }
}

const renewAccess = async (req: Request, res: Response) => {
  const { renewToken } = req.body
  try {
    if (!renewToken) {
      throw new HttpError(HttpStatusCode.BAD_REQUEST, ErrorTitle.LACK_OF_CREDENTIALS, ErrorMessage.LACK_OF_CREDENTIALS)
    }

    if (!jwtSecretRenewToken) {
      throw new Error('JWT secret renew token is not configured properly in the environment variables.')
    }

    // Verify and decode renew token
    const decodedResult = jwt.verify(renewToken, jwtSecretRenewToken) as jwt.JwtPayload

    // Check if renew token is expired
    if (!decodedResult || isTokenExpired(decodedResult.exp)) {
      throw new HttpError(HttpStatusCode.UNAUTHORIZED, ErrorTitle.TOKEN_EXPIRED, ErrorMessage.TOKEN_EXPIRED)
    }

    // Extract userId from decoded renew token
    const userId = decodedResult.userId
    const userRole = decodedResult.userRole

    if (!jwtSecretToken) {
      throw new Error('JWT secret token for access token is not configured properly in the environment variables.')
    }

    // Generate new access token
    const tokenPayload = { userId: userId, userRole: userRole }
    const finalAccessToken = jwt.sign(tokenPayload, jwtSecretToken, {
      expiresIn: getJwtExpiryTime(accessTokenLifeSpan),
    })

    new CustomResponse(res).send({ accessToken: finalAccessToken })
  } catch (error) {
    handleError(error, res)
  }
}

module.exports = {
  signUp,
  adminSignIn,
  signIn,
  renewAccess,
}
