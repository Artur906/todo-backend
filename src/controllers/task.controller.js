import { createTask, findTasks, findTaskById, updateTask, deleteTask } from "../services/task.services"

const create = async (req, res) => {
  const userId = req.user.id
  const taskData = { ...req.body, userId }

  try {
    const newTask = await createTask(taskData)
    return res.status(201).json(newTask)
  } catch (error) {
    if (error.message === 'TITLE_IS_REQUIRED') {
      return res.status(400).json({ message: 'Title is required' })
    } 

    console.error('Error creating task:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const getAll = async (req, res) => {
  const userId = req.user.id
  try {
    const tasks = await findTasks(userId)
    return res.status(200).json(tasks)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const getById = async (req, res) => {
  const userId = req.user.id
  const taskId = req.params.id  
  try {
    const task = await findTaskById(taskId, userId)
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }
    return res.status(200).json(task)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const update = async (req, res) => {
  const userId = req.user.id
  const taskId = req.params.id
  const updateData = req.body

  try {
    const updated = await updateTask(taskId, userId, updateData)
    if (!updated) {
      return res.status(404).json({ message: 'Task not found or no changes made' })
    }
    return res.status(200).json(updated)
  } catch (error) {
    if (error.message === 'TITLE_IS_REQUIRED') {
      return res.status(400).json({ message: 'Title is required' })
    }

    console.error('Error updating task:', error)

    return res.status(500).json({ message: 'Internal server error' })
  }
}

const remove = async (req, res) => {
  const userId = req.user.id
  const taskId = req.params.id
  try {
    const deleted = await deleteTask(taskId, userId)

    console.log('Delete result:', deleted) // Log the delete result for debugging
    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' })
    }
    return res.status(200).json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export { create, getAll, getById, update, remove }