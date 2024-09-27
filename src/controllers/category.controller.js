import mongoose from "mongoose";
import { Category, Brand } from "../models/category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const allCategory = asyncHandler(async (req, res) => {

    const category = await Category.find().select("-__v")

    if (!category) throw new ApiError(401, "Error in fetching category")
    return res.status(200).json(new ApiResponse(200, category, "Category fetched Successfully"))
})
const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body
    if (!name) throw new ApiError(400, "Name is required")
    const category = await Category.findOne({ name })
    if (category) throw new ApiError(401, "Category with this name is already exists")

    const newCategory = await Category.create({ name })
    if (!newCategory) throw new ApiError(401, "Error in creating category")
    return res.status(200).json(new ApiResponse(200, newCategory, "Category Created Successfully"))
})
const updateCategory = asyncHandler(async (req, res) => {
    const { name } = req.body
    const id = req.query.id
    if (!id) throw new ApiError(400, "Category id is missing")
    if (!name) throw new ApiError(400, "Name is required")
    const cat = await Category.findById(id)
    if (!cat) throw new ApiError(401, "Category not found")
    const newCategory = await Category.findByIdAndUpdate(id, {
        $set: {
            name
        }
    }, { new: true })
    if (!newCategory) throw new ApiError(401, "Error in updating category")
    return res.status(200).json(new ApiResponse(200
        , newCategory
        , "Category updated Successfully"))
})
const deleteCategory = asyncHandler(async (req, res) => {
    const id = req.query.id
    if (!id) throw new ApiError(400, "Category id is missing")
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid category id");
    }
    const cat = await Category.findById(id)
    if (!cat) throw new ApiError(401, "Category not found")
    await Category.findByIdAndDelete(id)
    return res.status(200).json(new ApiResponse(200, "Category deleted Successfully"))
})

const allBrand = asyncHandler(async (req, res) => {
    const data = await Brand.find()
    if (!data) {
        throw new ApiError(401, "Error is fetching brands")
    }
    return res.status(200)
        .json(new ApiResponse(200, data, "All Brand fetched successfully"))
})

const createBrand = asyncHandler(async (req, res) => {
    const { name } = req.body
    if (!name) throw new ApiError(400, "Name is required")
    const brand = await Brand.findOne({ name })
    if (brand) throw new ApiError(401, "Brand with this name is already exists")
    const newBrand = await Brand.create({ name })
    if (!newBrand) throw new ApiError(401, "Error in creating brand")
    return res.status(200)
        .json(new ApiResponse(200, newBrand, "Brand created successfully"))
})

const updateBrand = asyncHandler(async (req, res) => {
    const { name } = req.body
    const id = req.query.id
    if (!id) throw new ApiError(400, "Brand id is missing")
    if (!name) throw new ApiError(400, "Name is required")
    const brand = await Brand.findById(id)
    if (!brand) throw new ApiError(401, "Brand not found")
    const newBrand = await Brand.findByIdAndUpdate(id, {
        $set: {
            name
        }
    }, { new: true })
    if (!newBrand) throw new ApiError(401, "Error in updating brand")
    return res.status(200).json(new ApiResponse(200
        , newBrand
        , "Brand updated Successfully"))
})

const deleteBrand = asyncHandler(async (req, res) => {
    const id = req.query.id
    if (!id) throw new ApiError(400, "Brand id is missing")
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid brand id");
    }
    const brand = await Brand.findById(id)
    if (!brand) throw new ApiError(401, "Brand not found")
    await Brand.findByIdAndDelete(id)
    return res.status(200).json(new ApiResponse(200, "Brand deleted Successfully"))
})

export { createCategory, allCategory, updateCategory, deleteCategory, allBrand, createBrand, updateBrand, deleteBrand }