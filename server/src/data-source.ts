import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from './entity/User'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'ec2-54-194-211-183.eu-west-1.compute.amazonaws.com',
  port: 5432,
  username: 'fdffoxdcdmhnsv',
  password: 'e7e3dbe929f3ff2c4ece0c243c228ed695cbd8af4739eaa041f6694989d6035f',
  database: 'db5vnjv0ngb9gi',
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
  ssl: {
    rejectUnauthorized: false,
  },
})
