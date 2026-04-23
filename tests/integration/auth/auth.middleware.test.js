import '../../setup/integration.setup'
import request from 'supertest'
import { describe, it, expect, beforeEach } from 'vitest'
import app from '../../../src/app'
import { generateToken } from '../../utils/tokenHelper'
import { userFactory } from '../../utils/fakerData'
import User from '../../../src/models/User'
import jwt from 'jsonwebtoken'

describe('Auth Middleware', async () => {
  let userId

  beforeEach(async () => {
    // Create a user in the database for testing
    const userData = userFactory()
    const user = await User.create(userData)
    userId = user._id.toString()
  })
  
  it('should return 401 AUTHORIZATION_HEADER_MISSING when no authorization header is provided', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({ title: 'Test Task' })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('AUTHORIZATION_HEADER_MISSING')
  })

  it('should return 401 INVALID_AUTHORIZATION_HEADER when header does not start with Bearer', async () => {
    const response = await request(app)
      .post('/tasks')
      .set('Authorization', 'InvalidHeader')
      .send({ title: 'Test Task' })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('INVALID_AUTHORIZATION_HEADER')
  })

  it('should return 401 INVALID_AUTHORIZATION_HEADER when Bearer is provided without token', async () => {
    const response = await request(app)
      .post('/tasks')
      .set('Authorization', 'Bearer')
      .send({ title: 'Test Task' })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('INVALID_AUTHORIZATION_HEADER')
  })

  it('should return 401 INVALID_TOKEN when provided token is invalid', async () => {
    const response = await request(app)
      .post('/tasks')
      .set('Authorization', 'Bearer invalid.jwt.token')
      .send({ title: 'Test Task' })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('INVALID_TOKEN')
  })

  it('should return 401 TOKEN_EXPIRED when provided token is expired', async () => {
    const expiredToken = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: '-1h' }
    )

    const response = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${expiredToken}`)
      .send({ title: 'Test Task' })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe('TOKEN_EXPIRED')
  })

  it('should allow request to proceed when valid token is provided', async () => {
    const token = generateToken(userId)

    const response = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Task' })

    // Status should not be 401 - middleware passed successfully
    expect(response.status).not.toBe(401)
  })
})
