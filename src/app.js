import express from 'express'
import { config } from 'dotenv'
import authRoutes from './routes/auth.route.js'

config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})

const app = express()

app.use(express.json())
app.use('/auth', authRoutes)

module.exports = app