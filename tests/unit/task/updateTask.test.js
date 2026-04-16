import { it, describe, expect, vi, afterEach } from "vitest";
import { createTask } from "../../../src/services/task.services";
import { taskFactory } from "../../utils/fakerData";
import Task from "../../../src/models/Task";

const mockCreate = vi.spyOn(Task, 'create')

describe('Update Task', () => {

  afterEach(() => {
    vi.clearAllMocks()
  })  

  it('should update task title', () => { })
  it('should update task description', () => { })
  it('should mark a task as completed', () => { })
  it('should mark a completed task as pending', () => { })
  it('should not update a task with an empty title', () => { })
  it('should not update a task that does not exist', () => { })
  it('should not update a task that belongs to another user', () => { })
})

