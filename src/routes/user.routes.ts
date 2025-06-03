import { Router } from "express";
import { createUser, deleteUser, getAllUser, getSingleUser, updateUser } from "../controllers/user.controller";

const router=Router();

router.get('/',getAllUser)
router.get('/:id',getSingleUser)
router.post('/',createUser)
router.delete('/:id', deleteUser)
router.patch('/',updateUser)

export default router