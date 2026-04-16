import '../setup/integration.setup'
import request from 'supertest'
import { describe, it, expect, beforeEach } from 'vitest'
import app from '../../src/app'
import User from '../../src/models/User'
import { userFactory } from '../utils/fakerData'

describe('Auth - Register', async () => {
  let user 

  beforeEach(async () => {
    user = userFactory()
  })

  it('should create a new user', async () => {

    const response = await request(app)
      .post('/auth/register')
      .send(user)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.email).toBe(user.email)
  })

  it('should fail to create a new user without email', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        email: '',
        password: '123456'
      })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Email is required')
  })

  it('should fail to create a new user without password', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        email: 'test@email.com',
        password: ''
      })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Password is required')
  })

  it('should not allow duplicate email', async () => {
    await request(app).post('/auth/register').send(user)

    const response = await request(app).post('/auth/register').send(user)

    expect(response.status).toBe(409)
    expect(response.body.message).toBe('Email already exists')
  })

  it('should store hashed password', async () => {
    await request(app).post('/auth/register').send(user)
    
    const dbUser = await User.findOne({ email: user.email })

    expect(dbUser.password).not.toBe(user.password)
  })
})