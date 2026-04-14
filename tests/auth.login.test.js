import request from 'supertest'
import { describe, it, expect, beforeEach } from 'vitest'
import app from '../src/app'
import { userFactory } from './utils/fakerData'

describe('Auth - Login', async () => {
  let user

  beforeEach(async () => {
    user = userFactory()
  })

  it('should login an existing user', async () => {
    // First, create a user
    await request(app).post('/auth/register').send(user)
    
    // Then, try to login
    const response = await request(app)
      .post('/auth/login')
      .send(user)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
  })

  it('should not login an existing user with invalid password', async () => {
    // First, create a user
    await request(app).post('/auth/register').send(user)

    // Then, try to login
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: user.email,
        password: 'wrongpassword'
      })

    expect(response.status).toBe(401)
    expect(response.body).not.toHaveProperty('token')
    expect(response.body.message).toBe('Invalid credentials')
  })

  it('should not login an existing user with invalid email', async () => {

    // First, create a user
    await request(app).post('/auth/register').send(user)

    // Then, try to login
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'wrong@email.com',
        password: user.password
      })

    expect(response.status).toBe(401)
    expect(response.body).not.toHaveProperty('token')
    expect(response.body.message).toBe('Invalid credentials')
  })

  it('should not login an existing user with empty password', async () => {
    // First, create a user
    await request(app).post('/auth/register').send(user)

    // Then, try to login
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: user.email,
        password: ''
      })

    expect(response.status).toBe(400)
    expect(response.body).not.toHaveProperty('token')
    expect(response.body.message).toBe('Invalid credentials')
  })
})