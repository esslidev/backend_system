import { ErrorTitle, HttpStatusCode } from '../enums/response'

export class HttpError extends Error {
  public statusCode: HttpStatusCode
  public errorTitle: ErrorTitle
  public errorMessage: string
  public expiredAccessToken: boolean
  public expiredRenewToken: boolean

  constructor(
    statusCode: HttpStatusCode,
    errorTitle: ErrorTitle,
    errorMessage: string,
    { expiredAccessToken = false, expiredRenewToken = false } = {}
  ) {
    super(errorMessage)
    this.statusCode = statusCode
    this.errorTitle = errorTitle
    this.errorMessage = errorMessage
    this.expiredAccessToken = expiredAccessToken
    this.expiredRenewToken = expiredRenewToken
  }
}
