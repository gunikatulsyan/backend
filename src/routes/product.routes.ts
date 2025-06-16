import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getSingleProduct, updateProduct } from "../controllers/product.controller";
import {  authentication, authorization } from "../middleware/auth";

const router=Router();

router.get('/',authentication, getAllProducts)
router.get('/:id',authentication, getSingleProduct)
router.post('/',authentication, authorization("Admin"), createProduct)
router.delete('/:id',authentication, authorization("Admin"), deleteProduct)
router.patch('/',authentication, authorization("Admin"), updateProduct)

export default router