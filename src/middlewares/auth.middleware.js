import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization']
  if (!authHeader) {
    return res.status(401).json({ message: 'AUTHORIZATION_HEADER_MISSING' })
  }

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'INVALID_AUTHORIZATION_HEADER' })
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'TOKEN_MISSING' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'TOKEN_EXPIRED' })
    }

    return res.status(401).json({ message: 'INVALID_TOKEN' })
  }
}