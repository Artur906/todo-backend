import { it, describe, expect, vi, afterEach } from "vitest";
import { createTask } from "../../../src/services/task.services";
import { taskFactory } from "../../utils/fakerData";
import Task from "../../../src/models/Task";

const mockCreate = vi.spyOn(Task, 'create')

describe('Update Task', () => {

  afterEach(() => {
    vi.clearAllMocks()
  })  

  it('should delete an existing task', () => { })
  it('should not delete a task that does not exist', () => { })
  it('should not delete a task that belongs to another user', () => { })
})

