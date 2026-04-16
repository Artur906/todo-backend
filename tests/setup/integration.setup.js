import { beforeAll, afterAll } from 'vitest'
import { connectDB, disconnectDB } from '../../src/database.js'
import { config } from 'dotenv'
import mongoose from 'mongoose'

config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})

beforeAll(async () => {
  await connectDB()

  const collections = mongoose.connection.collections

  for (const key in collections) {
    await collections[key].deleteMany()
  }
})

afterAll(async () => {
  await disconnectDB()
})