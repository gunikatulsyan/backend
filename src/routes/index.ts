import { Router } from "express";
import productRoute from './product.routes'
import brandRoutes from './brand.routes'
const router=Router();


router.use('/product', productRoute)
router.use('/brand', brandRoutes)

export default router