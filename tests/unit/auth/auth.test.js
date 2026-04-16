import { it, describe, expect, vi, afterEach } from "vitest";
import { loginUser, registerUser } from "../../../src/services/auth.services";
import { userFactory } from "../../utils/fakerData";

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from "../../../src/models/User";

const hashMock = vi.spyOn(bcrypt, 'hash')
const compareMock = vi.spyOn(bcrypt, 'compare')
const jwtSignMock = vi.spyOn(jwt, 'sign')
const findOneMock = vi.spyOn(User, 'findOne')
const createMock = vi.spyOn(User, 'create')

describe('Auth Services', () => {

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should register a new user', async () => {
    const newUser = userFactory()

    findOneMock.mockResolvedValueOnce(null)
    hashMock.mockResolvedValueOnce('hashed_password')
    createMock.mockResolvedValueOnce({
      _id: 'mocked_user_id',
      email: newUser.email
    })

    const result = await registerUser(newUser)

    expect(findOneMock).toHaveBeenCalledTimes(1)
    expect(createMock).toHaveBeenCalledTimes(1)
    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('email', newUser.email)
  })

  it('should not register a user with an existing email', async () => {
    const existingUser = userFactory()
    findOneMock.mockResolvedValueOnce(existingUser)

    await expect(registerUser(existingUser))
      .rejects
      .toThrow('EMAIL_ALREADY_EXISTS')

    expect(findOneMock).toHaveBeenCalledTimes(1)
    expect(createMock).toHaveBeenCalledTimes(0)
  })

  it('should login an existing user', async () => {
    const existingUser = userFactory()
    findOneMock.mockResolvedValueOnce(existingUser)

    compareMock.mockResolvedValueOnce(true)
    jwtSignMock.mockReturnValueOnce('mocked_jwt_token')

    const result = await loginUser(existingUser)

    expect(findOneMock).toHaveBeenCalledTimes(1)
    expect(result).toHaveProperty('token')
  })

  it('should not login with non-existing email', async () => {
    const existingUser = userFactory()
    findOneMock.mockResolvedValueOnce(null)

    await expect(loginUser(existingUser))
      .rejects
      .toThrow('INVALID_CREDENTIALS')

    expect(findOneMock).toHaveBeenCalledTimes(1)
  })

  it('should not login with wrong password', async () => {
    const existingUser = userFactory()
    findOneMock.mockResolvedValueOnce(existingUser)
    compareMock.mockResolvedValueOnce(false)

    await expect(loginUser(existingUser))
      .rejects
      .toThrow('INVALID_CREDENTIALS')

    expect(findOneMock).toHaveBeenCalledTimes(1)
    expect(compareMock).toHaveBeenCalledTimes(1)
  })
})