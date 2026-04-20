import { Router } from "express";
import { create, update, getAll, getById, remove} from "../controllers/task.controller";

const router = Router()

router.post('/task', create)
router.put('/task/:id', update)
router.delete('/task/:id', remove)
router.get('/task/:id', getById)
router.get('/tasks', getAll)

export default router