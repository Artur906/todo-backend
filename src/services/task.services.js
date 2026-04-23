import Task from "../models/Task";

const createTask = async (taskData) => {
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

const findTasks = async (userId) => {
  return await Task.find({ userId })
}

const findTaskById = async (taskId, userId) => {
  const task = await Task.findById(taskId)

  if (!task) {
    return null
  } else if (task.userId.toString() !== userId) {
    return null
  }
  return task
}

const updateTask = async (taskId, userId, updateData) => {
  if (updateData.title !== undefined && updateData.title.trim() === '') {
    throw new Error('TITLE_IS_REQUIRED')
  }

  const result = await Task.updateOne(
    { _id: taskId, userId },
    { $set: updateData }
  ) 

  return result.modifiedCount > 0
}

const deleteTask = async (taskId, userId) => {
  const result = await Task.deleteOne({ _id: taskId, userId })
  return result.deletedCount > 0
}

export { createTask, findTasks, findTaskById, updateTask, deleteTask }