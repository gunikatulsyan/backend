import { Router } from "express";
import { createUser, deleteUser, getAllUser, getSingleUser, updateUser } from "../controllers/user.controller";
import { authentication, authorization } from "../middleware/auth";

const router=Router();

router.get('/',authentication, getAllUser)
router.get('/:id',authentication, getSingleUser)
router.post('/',authentication,authorization("Admin"),createUser)
router.delete('/:id',authentication,authorization("Admin"), deleteUser)
router.patch('/',authentication,authorization("Admin"), updateUser)

export default router