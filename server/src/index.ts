import 'reflect-metadata'
import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import { AppDataSource } from './data-source'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { UserResolver } from './UserResolver'
import { verify } from 'jsonwebtoken'
import { User } from './entity/User'
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from './utils/utils'
import cors from 'cors'

const corsOption = { origin: 'http://localhost:3000', credentials: true }
const app = express()

// set cors for direct api call from client
app.use(cors(corsOption))
const start = async () => {
  app.use(cookieParser())
  app.get('/', (_, res) => res.send('hi'))

  app.post('/refresh_token', async (req, res) => {
    const token = req.cookies.tudiid
    if (!token) {
      return res.send({ ok: false, accessToken: '' })
    }
    let payload: any = null
    try {
      payload = verify(token, process.env.REFRESH_TOKEN!)
    } catch (err) {
      console.error(err)
      return res.send({ ok: false, accessToken: '' })
    }

    const user = await User.findOne({ where: { id: payload.userID } })

    if (!user) {
      return res.send({ ok: false, accessToken: '' })
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: '' })
    }

    sendRefreshToken(res, createRefreshToken(user))

    return res.send({ ok: true, accessToken: createAccessToken(user) })
  })

  AppDataSource.initialize()

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  })
  await apolloServer.start()
  // set cors for ApolloClient
  apolloServer.applyMiddleware({ app, cors: corsOption })
  app.listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`)
  })
}

start()
