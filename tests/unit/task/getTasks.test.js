import { it, describe, expect, vi, afterEach } from "vitest";
import { createTask } from "../../../src/services/task.services";
import { taskFactory } from "../../utils/fakerData";
import Task from "../../../src/models/Task";

const mockCreate = vi.spyOn(Task, 'create')

describe('Get Tasks', () => {

  afterEach(() => {
    vi.clearAllMocks()
  })  

  it('should return all tasks for the authenticated user', async () => {
  })
  it('should return an empty array if user has no tasks', async () => {
  })
})

describe('Get Tasks by ID', () => {

  afterEach(() => {
    vi.clearAllMocks()
  })  

  it('should return a task by id', async () => {
  })
  it('should not return a task that does not exist', async () => {
  })
  it('should not return a task that belongs to another user', async () => {
  })
})