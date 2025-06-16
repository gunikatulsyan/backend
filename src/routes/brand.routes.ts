import { Router } from "express";
import { createBrand, deleteBrand, getAllBrands, getSingleBrand, updateBrand } from "../controllers/brand.controller";
import { authentication, authorization } from "../middleware/auth";

const router=Router();

router.get('/',authentication, getAllBrands)
router.get('/:id',authentication,getSingleBrand)
router.post('/',authentication, authorization("Admin"), createBrand)
router.delete('/:id',authentication, authorization("Admin"), deleteBrand)
router.patch('/',authentication, authorization("Admin"), updateBrand)

export default router