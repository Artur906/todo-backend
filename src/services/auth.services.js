import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const registerUser = async ({ email, password }) => {
  const existingUser = await User.findOne({ email })

  if (existingUser) {
    throw new Error('EMAIL_ALREADY_EXISTS')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = await User.create({ email, password: hashedPassword })

  return {
    id: newUser._id,
    email: newUser.email
  }
}

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error('INVALID_CREDENTIALS')
  }

  const isValidPassword = await bcrypt.compare(password, user.password)

  if (!isValidPassword) {
    throw new Error('INVALID_CREDENTIALS')
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

  return { token }
}

export { registerUser, loginUser }