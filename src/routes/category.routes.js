import { Router } from "express";
import { isAdmin } from "../middlewares/auth.middleware.js";
import { allBrand, allCategory, createBrand, createCategory, deleteBrand, deleteCategory, updateBrand, updateCategory } from "../controllers/category.controller.js";

const router = Router()

router.route("/").post(isAdmin, createCategory).get(allCategory)
router.route("/").patch(isAdmin, updateCategory).delete(isAdmin, deleteCategory)
router.route("/brand").get(isAdmin, allBrand).post(isAdmin, createBrand).patch(isAdmin, updateBrand).delete(isAdmin, deleteBrand)
export default router;
