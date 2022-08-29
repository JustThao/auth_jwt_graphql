import { verify, sign } from 'jsonwebtoken'
import { MiddlewareFn } from 'type-graphql'
import { Context } from '../Context'
import { Response } from 'express'
import { User } from '../entity/User'

// TODO: split up later in separate files

export const isAuth: MiddlewareFn<Context> = ({ context }, next) => {
  const authorization = context.req.headers['authorization']

  if (!authorization) {
    throw new Error('not authenticated')
  }

  try {
    const token = authorization?.split(' ')[1]
    const payload = verify(token, process.env.ACCESS_TOKEN!)
    context.payload = payload as any
  } catch (err) {
    console.error(err)
  }
  return next()
}

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie('tudiid', token, { httpOnly: true, path: '/refresh_token' })
}

export const createAccessToken = (user: User) =>
  sign({ userID: user.id }, process.env.ACCESS_TOKEN!, {
    expiresIn: '10m',
  })

export const createRefreshToken = (user: User) =>
  sign(
    { userID: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN!,
    {
      expiresIn: '1d',
    }
  )
