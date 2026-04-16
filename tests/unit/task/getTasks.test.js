import { it, describe, expect, vi, afterEach } from "vitest";
import { findTasks, findTaskById } from "../../../src/services/task.services";
import { taskFactory } from "../../utils/fakerData";
import Task from "../../../src/models/Task";

const mockFind = vi.spyOn(Task, 'find')
const mockFindById = vi.spyOn(Task, 'findById')

describe('Get Tasks', () => {

  afterEach(() => {
    vi.clearAllMocks()
  })  

  it('should return all tasks for the authenticated user', async () => {
    const userId = 'mocked_user_id'
    const tasks = [
      taskFactory({ userId }),
      taskFactory({ userId }),
      taskFactory({ userId })
    ]
    mockFind.mockResolvedValue(tasks)
    const result = await findTasks(userId)

    expect(mockFind).toHaveBeenCalledTimes(1)
    expect(mockFind).toHaveBeenCalledWith({ userId })
    expect(result).toHaveLength(3)
  })

  it('should return an empty array if user has no tasks', async () => {
    const userId = 'mocked_user_id'
    mockFind.mockResolvedValue([])
    const result = await findTasks(userId)

    expect(mockFind).toHaveBeenCalledTimes(1)
    expect(mockFind).toHaveBeenCalledWith({ userId })
    expect(result).toHaveLength(0)
  })
})

describe('Get Tasks by ID', () => {

  afterEach(() => {
    vi.clearAllMocks()
  })  

  it('should return a task by id', async () => {
    const userId = 'mocked_user_id'
    const task = taskFactory({ userId })
    task._id = 'mocked_task_id'

    mockFindById.mockResolvedValue(task)
    const result = await findTaskById(task._id, userId)

    expect(mockFindById).toHaveBeenCalledTimes(1)
    expect(mockFindById).toHaveBeenCalledWith(task._id)
    expect(result).toEqual(task)
  })
  it('should not return a task that does not exist', async () => {
    const userId = 'mocked_user_id'
    const taskId = 'non_existent_task_id'
    mockFindById.mockResolvedValue(null)
    const result = await findTaskById(taskId, userId)

    expect(mockFindById).toHaveBeenCalledTimes(1)
    expect(mockFindById).toHaveBeenCalledWith(taskId)
    expect(result).toBeNull()
  })
  it('should not return a task that belongs to another user', async () => {
    const userId = 'mocked_user_id'
    const taskId = 'mocked_task_id'
    const task = taskFactory({ userId: 'another_user_id' })
    task._id = taskId
    mockFindById.mockResolvedValue(task)
    const result = await findTaskById(taskId, userId)

    expect(mockFindById).toHaveBeenCalledTimes(1)
    expect(mockFindById).toHaveBeenCalledWith(taskId)
    expect(result).toBeNull()
  })
})