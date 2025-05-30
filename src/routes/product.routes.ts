import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getSingleProduct, updateProduct } from "../controllers/product.controller";

const router=Router();

router.get('/', getAllProducts)
router.get('/:id',getSingleProduct)
router.post('/',createProduct)
router.delete('/:id', deleteProduct)
router.patch('/', updateProduct)

export default router