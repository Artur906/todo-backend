import { it, describe, expect, vi, afterEach } from "vitest";
import { updateTask } from "../../../src/services/task.services";
import { taskFactory } from "../../utils/fakerData";
import Task from "../../../src/models/Task";

const mockUpdate = vi.spyOn(Task, 'updateOne')

describe('Update Task', async () => {

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should update task title', async () => {
    const userId = 'mocked_user_id'
    const taskId = 'mocked_task_id'
    const updatedTitle = 'Updated Task Title'
    const task = taskFactory({ userId })
    task._id = taskId

    mockUpdate.mockResolvedValue({ modifiedCount: 1 })
    const result = await updateTask(taskId, userId, { title: updatedTitle })

    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledWith(
      { _id: taskId, userId },
      { $set: { title: updatedTitle } }
    )
    expect(result).toBe(true)
  })

  it('should update task description', async () => {
    const userId = 'mocked_user_id'
    const taskId = 'mocked_task_id'
    const updatedDescription = 'Updated Task Description'
    const task = taskFactory({ userId })
    task._id = taskId

    mockUpdate.mockResolvedValue({ modifiedCount: 1 })
    const result = await updateTask(taskId, userId, { description: updatedDescription })

    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledWith(
      { _id: taskId, userId },
      { $set: { description: updatedDescription } }
    )
    expect(result).toBe(true)
  })

  it('should mark a task as completed', async () => {
    const userId = 'mocked_user_id'
    const taskId = 'mocked_task_id'
    const task = taskFactory({ userId })
    task._id = taskId
    mockUpdate.mockResolvedValue({ modifiedCount: 1 })
    const result = await updateTask(taskId, userId, { status: 'completed' })

    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledWith(
      { _id: taskId, userId },
      { $set: { status: 'completed' } }
    )
    expect(result).toBe(true)
  })

  it('should mark a completed task as pending', async () => {
    const userId = 'mocked_user_id'
    const taskId = 'mocked_task_id'
    const task = taskFactory({ userId })
    task._id = taskId
    mockUpdate.mockResolvedValue({ modifiedCount: 1 })
    const result = await updateTask(taskId, userId, { status: 'pending' })

    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledWith(
      { _id: taskId, userId },
      { $set: { status: 'pending' } }
    )
    expect(result).toBe(true)
  })

  it('should not update a task with an empty title', async () => {
    const userId = 'mocked_user_id'
    const taskId = 'mocked_task_id'
    const task = taskFactory({ userId })
    task._id = taskId
    const updatedTitle = '   '

    await expect(updateTask(taskId, userId, { title: updatedTitle }))
      .rejects
      .toThrow('TITLE_IS_REQUIRED')

    expect(mockUpdate).toHaveBeenCalledTimes(0)
  })

  it('should not update a task that does not exist', async () => {
    const userId = 'mocked_user_id'
    const taskId = 'non_existent_task_id'
    mockUpdate.mockResolvedValue({ modifiedCount: 0 })
    const result = await updateTask(taskId, userId, { title: 'Updated Title' })

    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(result).toBe(false)
  })

  it('should not update a task that belongs to another user', async () => {
    const userId = 'mocked_user_id'
    const taskId = 'mocked_task_id'
    mockUpdate.mockResolvedValue({ modifiedCount: 0 })
    const result = await updateTask(taskId, userId, { title: 'Updated Title' })

    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(result).toBe(false)
  })
})