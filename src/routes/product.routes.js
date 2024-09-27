import { Router } from "express";
import { isAdmin } from "../middlewares/auth.middleware.js";
import { allProducts, postProduct } from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/").get(isAdmin, allProducts).post(upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 6 }
]), isAdmin, postProduct)
export default router;
