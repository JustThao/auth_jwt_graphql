import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx,
  Int,
} from 'type-graphql'
import { User } from './entity/User'
import { compare, hash } from 'bcryptjs'
import { Context } from './Context'
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from './utils/utils'
import { AppDataSource } from './data-source'
import { verify } from 'jsonwebtoken'

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string
  @Field(() => User)
  user: User
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  test() {
    return 'testii'
  }

  @Query(() => User, { nullable: true })
  privateProfile(@Ctx() context: Context) {
    const authorization = context.req.headers['authorization']

    if (!authorization) {
      return null
    }

    try {
      const token = authorization.split(' ')[1]
      const payload: any = verify(token, process.env.ACCESS_TOKEN!)
      context.payload = payload as any
      return User.find({ where: { id: payload.userID } }).then(
        (data) => data[0]
      )
    } catch (err) {
      console.log(err)
      return null
    }
  }

  @Query(() => [User])
  users() {
    return User.find()
  }

  @Mutation(() => Boolean)
  async register(@Arg('email') email: string, @Arg('pw') pw: string) {
    const hashedPw = await hash(pw, 12)

    try {
      await User.insert({
        email,
        pw: hashedPw,
      })
    } catch (err) {
      console.error(err)
      return false
    }
    return true
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('pw') pw: string,
    @Ctx() { res }: Context
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } })
    if (!user) {
      throw new Error('user not defined')
    }

    const validPw = await compare(pw, user.pw)
    if (!validPw) {
      throw new Error('wrong PW')
    }

    // refresh token
    sendRefreshToken(res, createRefreshToken(user))

    // access token
    return {
      accessToken: createAccessToken(user),
      user,
    }
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokens(@Arg('userID', () => Int) userID: number) {
    await AppDataSource.getRepository(User).increment(
      { id: userID },
      'tokenVersion',
      1
    )
    return true
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: Context) {
    sendRefreshToken(res, '')
    return true
  }
}
