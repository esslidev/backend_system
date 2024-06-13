import { PrismaClient, Role, User } from '@prisma/client'
import { Request, Response } from 'express'
import { ErrorMessage, ErrorTitle, HttpStatusCode } from '../core/enums/response'
import { HttpError } from '../core/response/httpError'
import { handleError } from '../core/utils/errorHandler'
import CustomResponse from '../core/response/apiResponse'
import { saltAndHashPassword, verifyPassword } from '../core/utils/utils'

const prisma = new PrismaClient()

const getUser = async (req: Request, res: Response) => {
  const { userId } = req.body

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new HttpError(HttpStatusCode.NOT_FOUND, ErrorTitle.NOT_FOUND, ErrorMessage.NOT_FOUND)
    }

    const responseUser = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    }

    new CustomResponse(res).send({ data: responseUser })
  } catch (error) {
    handleError(error, res)
  }
}

const getUsers = async (req: Request, res: Response) => {
  const { userId } = req.body
  const { orderByAlphabets, search, limit = 10, page = 1 } = req.query
  console.log('worked!!')
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) {
      throw new HttpError(HttpStatusCode.NOT_FOUND, ErrorTitle.NOT_FOUND, ErrorMessage.NOT_FOUND)
    }

    if (!user || user.role != Role.admin) {
      throw new HttpError(HttpStatusCode.FORBIDDEN, ErrorTitle.FORBIDDEN, ErrorMessage.FORBIDDEN)
    }

    const take = Number(limit)
    const skip = (Number(page) - 1) * take

    const filters: any = {
      role: { not: 'admin' }, // Exclude admin users
    }

    if (search) {
      filters.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    const order: any = orderByAlphabets ? { lastName: 'asc' } : { createdAt: 'desc' }

    const users = await prisma.user.findMany({
      where: filters,
      orderBy: order,
      skip: skip,
      take: take,
    })

    // Specify the fields to be sent in the response
    const responseUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }))

    console.log(responseUsers)

    new CustomResponse(res).send({ data: responseUsers })
  } catch (error) {
    handleError(error, res)
  }
}

const updateUser = async (req: Request, res: Response) => {
  const { userId, firstName, lastName, imageUrl } = req.body

  try {
    let existingUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!existingUser) {
      throw new HttpError(HttpStatusCode.BAD_REQUEST, ErrorTitle.NOT_FOUND, ErrorMessage.NOT_FOUND)
    }

    const updatedUserData = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(imageUrl && { imageUrl }),
    }

    let updateUser: Partial<User> | null = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updatedUserData,
    })

    if (!updateUser) {
      throw new HttpError(HttpStatusCode.NOT_FOUND, ErrorTitle.NOT_FOUND, ErrorMessage.NOT_FOUND)
    }

    const responseUser = {
      email: updateUser.email,
      firstName: updateUser.firstName,
      lastName: updateUser.lastName,
      imageUrl: updateUser.imageUrl,
    }

    new CustomResponse(res).send({ data: responseUser })
  } catch (error) {
    handleError(error, res)
  }
}

const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.body

  try {
    await prisma.user.delete({ where: { id: userId } })
    new CustomResponse(res).send({ message: 'User deleted successfully.' })
  } catch (error) {
    handleError(error, res)
  }
}

export {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
}
