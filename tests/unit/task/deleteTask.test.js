import { it, describe, expect, vi, afterEach } from "vitest";
import { deleteTask } from "../../../src/services/task.services";
import { taskFactory } from "../../utils/fakerData";
import Task from "../../../src/models/Task";

const mockDelete = vi.spyOn(Task, 'deleteOne')

describe('Delete Task', () => {

  afterEach(() => {
    vi.clearAllMocks()
  })  

  it('should delete an existing task', async () => {
    const userId = 'mocked_user_id'
    const taskId = 'mocked_task_id'
    const task = taskFactory({ userId })
    task._id = taskId

    mockDelete.mockResolvedValue({ deletedCount: 1 })
    const result = await deleteTask(taskId, userId)

    expect(mockDelete).toHaveBeenCalledTimes(1)
    expect(mockDelete).toHaveBeenCalledWith({ _id: taskId, userId })
    expect(result).toBe(true)
  })

  it('should not delete a task that does not exist', async () => {
    const userId = 'mocked_user_id'
    const taskId = 'non_existent_task_id'

    mockDelete.mockResolvedValue({ deletedCount: 0 })
    const result = await deleteTask(taskId, userId)

    expect(mockDelete).toHaveBeenCalledTimes(1)
    expect(mockDelete).toHaveBeenCalledWith({ _id: taskId, userId })
    expect(result).toBe(false)
  })

  it('should not delete a task that belongs to another user', async () => {
    const userId = 'mocked_user_id'
    const taskId = 'mocked_task_id'

    mockDelete.mockResolvedValue({ deletedCount: 0 })
    const result = await deleteTask(taskId, userId)

    expect(mockDelete).toHaveBeenCalledTimes(1)
    expect(mockDelete).toHaveBeenCalledWith({ _id: taskId, userId })
    expect(result).toBe(false)
  })
})

