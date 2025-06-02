import { Router } from "express";
import { createBrand, deleteBrand, getAllBrands, getSingleBrand, updateBrand } from "../controllers/brand.controller";

const router=Router();

router.get('/', getAllBrands)
router.get('/:id',getSingleBrand)
router.post('/',createBrand)
router.delete('/:id', deleteBrand)
router.patch('/', updateBrand)

export default router