import { Router } from "express";
import { isAdmin } from "../middlewares/auth.middleware.js";
import { allProducts, postProduct, singleProduct, updateProduct } from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/").get(isAdmin, allProducts).post(upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 6 }
]), isAdmin, postProduct).get(isAdmin, singleProduct)
router.route("/details").get(isAdmin, singleProduct)
router.route("/edit")
    .patch(upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'images', maxCount: 6 }
    ]), isAdmin, updateProduct);
export default router;
