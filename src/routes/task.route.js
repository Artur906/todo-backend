import { Router } from "express";
import { create, update, getAll, getById, remove} from "../controllers/task.controller";

const router = Router()

router.post('', create)
router.put('/:id', update)
router.delete('/:id', remove)
router.get('/:id', getById)
router.get('', getAll)

export default router