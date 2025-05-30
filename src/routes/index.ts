import { Router } from "express";
import productRoute from './product.routes'
const router=Router();

router.use('/product', productRoute)

export default router