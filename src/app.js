import express from 'express'
import { config } from 'dotenv'
import authRoutes from './routes/auth.route.js'
import taskRoutes from './routes/task.route.js'
import { authMiddleware } from './middlewares/auth.middleware.js'

config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})

const app = express()

app.use(express.json())
app.use('/auth', authRoutes)
app.use('/tasks', authMiddleware, taskRoutes)


module.exports = app