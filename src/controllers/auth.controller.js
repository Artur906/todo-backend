import User from "../models/User"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const register = async (req, res) => {
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
}

const login = async (req, res) => {
  const { email, password } = req.body || {}

  if(!email || !password) {
    return res.status(400).json({ message: 'Invalid credentials' })
  }

  const user = await User.findOne({ email })

  if(!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const isValidPassword = await bcrypt.compare(password, user.password)

  if(!isValidPassword) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
  
  return res.status(200).json({
    token
  })
}

export { register, login }

