import { it, describe, expect, vi, afterEach } from "vitest";
import { createTask } from "../../../src/services/task.services";
import { taskFactory } from "../../utils/fakerData";
import Task from "../../../src/models/Task";

const mockCreate = vi.spyOn(Task, 'create')

describe('Create Task', () => {

  afterEach(() => {
    vi.clearAllMocks()
  })  

  it('should create a task with title only', async () => {
    const newTask = taskFactory({description: '', userId: 'mocked_user_id'})

    mockCreate.mockResolvedValueOnce({
      _id: 'mocked_task_id',
      title: newTask.title,
      description: '',
      status: 'pending',
      userId: newTask.userId
    })
    
    const createdTask = await createTask(newTask) 
    
    expect(createdTask).toHaveProperty('id')
    expect(createdTask).toHaveProperty('title', newTask.title)
    expect(createdTask).toHaveProperty('description', '')
    expect(createdTask).toHaveProperty('status', 'pending')
    expect(createdTask).toHaveProperty('userId', newTask.userId)
  })

  it('should create a task with title and description', async () => {
    const newTask = taskFactory({ userId: 'mocked_user_id'})

    mockCreate.mockResolvedValueOnce({
      _id: 'mocked_task_id',
      title: newTask.title,
      description: newTask.description,
      status: 'pending',
      userId: newTask.userId
    })

    const createdTask = await createTask(newTask) 

    expect(createdTask).toHaveProperty('id')
    expect(createdTask).toHaveProperty('title', newTask.title)
    expect(createdTask).toHaveProperty('description', newTask.description)
    expect(createdTask).toHaveProperty('status', 'pending')
    expect(createdTask).toHaveProperty('userId', newTask.userId)
  
  })

  it('should not create a task without a title', async () => {
    const newTask = taskFactory({ userId: 'mocked_user_id'})
    newTask.title = ''

    await expect(createTask(newTask))
      .rejects
      .toThrow('TITLE_IS_REQUIRED')

    expect(mockCreate).toHaveBeenCalledTimes(0)
  })

  it('should not create a task with an empty title', async () => {
    const newTask = taskFactory({ title: '   ', userId: 'mocked_user_id'})

    await expect(createTask(newTask))
      .rejects
      .toThrow('TITLE_IS_REQUIRED')

    expect(mockCreate).toHaveBeenCalledTimes(0)
  })
})

