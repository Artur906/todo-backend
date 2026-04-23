import jwt from 'jsonwebtoken'

export const generateToken = (userId) => {
  const payload = { id: userId }
  const token = jwt.sign(payload, process.env.JWT_SECRET)
  return token
}
