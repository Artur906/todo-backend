import '../../setup/integration.setup'
import request from 'supertest'
import { describe, it, expect, beforeEach } from 'vitest'
import app from '../../../src/app'
import { generateToken } from '../../utils/tokenHelper'
import { taskFactory, userFactory } from '../../utils/fakerData'
import User from '../../../src/models/User'
import { faker } from '@faker-js/faker'

describe('Tasks Routes - Authentication', async () => {
  let token
  let userId
  let taskData
  let user

  beforeEach(async () => {
    // Create a user in the database
    const userData = userFactory()
    user = await User.create(userData)
    userId = user._id.toString()
    token = generateToken(userId)
    taskData = taskFactory()
  })

  describe('POST /tasks', () => {
    it('should return 401 when no authorization header is provided', async () => {
      const response = await request(app)
        .post('/tasks')
        .send(taskData)

      expect(response.status).toBe(401)
      expect(response.body.message).toBe('AUTHORIZATION_HEADER_MISSING')
    })

    it('should return 401 when authorization token is invalid', async () => {
      const response = await request(app)
        .post('/tasks')
        .set('Authorization', 'Bearer invalid.token')
        .send(taskData)

      expect(response.status).toBe(401)
      expect(response.body.message).toBe('INVALID_TOKEN')
    })

    it('should create a task with valid token and valid data', async () => {
      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(taskData)

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('title', taskData.title)
      expect(response.body).toHaveProperty('userId')
    })

    it('should return 400 when title is missing', async () => {
      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ description: 'Test description' })

      expect(response.status).toBe(400)
      expect(response.body.message).toBe('Title is required')
    })
  })

  describe('GET /tasks', () => {
    it('should return 401 when no authorization header is provided', async () => {
      const response = await request(app)
        .get('/tasks')

      expect(response.status).toBe(401)
      expect(response.body.message).toBe('AUTHORIZATION_HEADER_MISSING')
    })

    it('should return 401 when authorization token is invalid', async () => {
      const response = await request(app)
        .get('/tasks')
        .set('Authorization', 'Bearer invalid.token')

      expect(response.status).toBe(401)
      expect(response.body.message).toBe('INVALID_TOKEN')
    })

    it('should return user tasks with valid token', async () => {
      // Create a task first
      const createResponse = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(taskData)

      // Get all tasks
      const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBeGreaterThan(0)
      expect(response.body[0]).toHaveProperty('userId')
    })
  })

  describe('GET /tasks/:id', () => {
    it('should return 401 when no authorization header is provided', async () => {
      const fakeId = faker.database.mongodbObjectId()

      const response = await request(app)
        .get(`/tasks/${fakeId}`)

      expect(response.status).toBe(401)
      expect(response.body.message).toBe('AUTHORIZATION_HEADER_MISSING')
    })

    it('should return 401 when authorization token is invalid', async () => {
      const fakeId = faker.database.mongodbObjectId()

      const response = await request(app)
        .get(`/tasks/${fakeId}`)
        .set('Authorization', 'Bearer invalid.token')

      expect(response.status).toBe(401)
      expect(response.body.message).toBe('INVALID_TOKEN')
    })

    it('should return task when valid token is provided and task belongs to user', async () => {
      // Create a task first
      const createResponse = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(taskData)

      const taskId = createResponse.body.id

      // Get the task
      const response = await request(app)
        .get(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('_id', taskId)
      expect(response.body).toHaveProperty('userId')
    })

    it('should return 404 when task does not exist', async () => {
      const fakeId = faker.database.mongodbObjectId()

      const response = await request(app)
        .get(`/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(404)
    })
  })

  describe('PUT /tasks/:id', () => {
    it('should return 401 when no authorization header is provided', async () => {
      const fakeId = faker.string.uuid()

      const response = await request(app)
        .put(`/tasks/${fakeId}`)
        .send({ title: 'Updated Task' })

      expect(response.status).toBe(401)
      expect(response.body.message).toBe('AUTHORIZATION_HEADER_MISSING')
    })

    it('should return 401 when authorization token is invalid', async () => {
      const fakeId = faker.string.uuid()

      const response = await request(app)
        .put(`/tasks/${fakeId}`)
        .set('Authorization', 'Bearer invalid.token')
        .send({ title: 'Updated Task' })

      expect(response.status).toBe(401)
      expect(response.body.message).toBe('INVALID_TOKEN')
    })

    it('should update task when valid token is provided and task belongs to user', async () => {
      // Create a task first
      const createResponse = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(taskData)

      const taskId = createResponse.body.id
      const updatedData = { title: 'Updated Task', description: 'Updated Description' }

      // Update the task
      const response = await request(app)
        .put(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData)

      expect(response.status).toBe(200)
    })

    it('should return error when updating non-existent task', async () => {
      const fakeId = faker.database.mongodbObjectId()

      const response = await request(app)
        .put(`/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated Task' })

      expect(response.status).toBe(404)
    })
  })

  describe('DELETE /tasks/:id', () => {
    it('should return 401 when no authorization header is provided', async () => {
      const fakeId = faker.string.uuid()

      const response = await request(app)
        .delete(`/tasks/${fakeId}`)

      expect(response.status).toBe(401)
      expect(response.body.message).toBe('AUTHORIZATION_HEADER_MISSING')
    })

    it('should return 401 when authorization token is invalid', async () => {
      const fakeId = faker.string.uuid()

      const response = await request(app)
        .delete(`/tasks/${fakeId}`)
        .set('Authorization', 'Bearer invalid.token')

      expect(response.status).toBe(401)
      expect(response.body.message).toBe('INVALID_TOKEN')
    })

    it('should delete task when valid token is provided and task belongs to user', async () => {
      // Create a task first
      const createResponse = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(taskData)

      const taskId = createResponse.body.id

      // Delete the task
      const response = await request(app)
        .delete(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body.message).toBe('Task deleted successfully')
    })

    it('should return error when deleting non-existent task', async () => {
      const fakeId = faker.database.mongodbObjectId()

      const response = await request(app)
        .delete(`/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(404)
    })
  })
})
