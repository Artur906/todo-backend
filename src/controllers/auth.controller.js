import { loginUser, registerUser } from "../services/auth.services"


const register = async (req, res) => {
  const { email, password } = req.body || {}

  if (!email) {
    return res.status(400).json({ message: 'Email is required' })
  }

  if (!password) {
    return res.status(400).json({ message: 'Password is required' })
  }

  try {
    const newUser = await registerUser({ email, password })

    return res.status(201).json({
      id: newUser.id,
      email: newUser.email
    })

  } catch (error) {

    if (error.message === 'EMAIL_ALREADY_EXISTS') {
      return res.status(409).json({ message: 'Email already exists' })
    }

    return res.status(500).json({ message: 'Internal server error' })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body || {}

  if (!email || !password) {
    return res.status(400).json({ message: 'Invalid credentials' })
  }

  try {
    const { token } = await loginUser({ email, password })

    return res.status(200).json({ token })
  } catch (error) {
    if (error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    return res.status(500).json({ message: 'Internal server error' })   
  }
}

export { register, login }