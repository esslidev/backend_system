import { Response } from 'express'
import { HttpStatusCode } from '../enums/response'

class CustomResponse {
  constructor(private res: Response) {}

  send(
    data?: any,
    {
      statusCode = HttpStatusCode.OK,
      statusMessage = 'Success',
    }: { statusCode?: HttpStatusCode; statusMessage?: string } = {}
  ) {
    return this.res.status(statusCode).json({
      ...data,
      status: statusMessage,
    })
  }
}

export default CustomResponse
