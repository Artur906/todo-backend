import express from 'express'
import User from './models/User'
import { config } from 'dotenv'
import bcrypt from 'bcrypt'

config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})

const app = express()

app.use(express.json())

app.post('/auth/register', async (req, res) => {
  const { email, password } = req.body || {}

  if(!email) {
    return res.status(400).json({ message: 'Email is required' })
  }

  if(!password) {
    return res.status(400).json({ message: 'Password is required' })
  }

  const existingUser = await User.findOne({ email })

  if(existingUser) {
    return res.status(409).json({ message: 'Email already exists' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = new User({ email, password: hashedPassword })

  await newUser.save()

  return res.status(201).json({
    id: newUser._id,
    email: newUser.email
  })
})

module.exports = app