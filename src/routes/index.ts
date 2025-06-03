import { Router } from "express";
import productRoute from './product.routes'
import brandRoutes from './brand.routes'
import userRoutes from './user.routes'
const router=Router();


router.use('/product', productRoute)
router.use('/brand', brandRoutes)
router.use('/user', userRoutes)


export default router