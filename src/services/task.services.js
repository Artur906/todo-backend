import Task from "../models/Task";

export const createTask = async (taskData) => {
  const { title } = taskData
  if (!title || title.trim() === '') {
    throw new Error('TITLE_IS_REQUIRED')
  }

  const newTask = await Task.create(taskData)

  return {
    id: newTask._id,
    title: newTask.title,
    description: newTask.description,
    status: newTask.status,
    userId: newTask.userId
  }
};