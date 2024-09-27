import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const allProducts = asyncHandler(async (req, res) => {
    const products = await Product.find().select("-__v -additionalInfo -description")
    if (!products) throw new ApiError("Error in fetching products")
    return res.status(200)
        .json(new ApiResponse(200, products, "All product fetched successfully"))
})

const postProduct = asyncHandler(async (req, res) => {
    const { title, description, additionalInfo, type, price, brand, category, quantity } = req.body
    const thumbnailLocalImagePath = req?.files?.thumbnail[0]?.path
    const imagesLocalImage = req?.files?.images
    if (!thumbnailLocalImagePath) throw new ApiError(400, "Thumbnail is required!")
    if (!imagesLocalImage) throw new ApiError(400, "Images is required!")
    const thumbnailImage = await uploadOnCloudinary(thumbnailLocalImagePath)
    if (!thumbnailImage) throw new ApiError(401, "Server Error")
    let uploadedImages = [];
    for (const image of imagesLocalImage) {
        let result = await uploadOnCloudinary(image.path)
        if (!result) throw new ApiError("Server Error")
        uploadedImages.push(result.secure_url)
    }
    const newProduct = {
        title,
        description,
        additionalInfo,
        author: req.user._id,
        type,
        price,
        brand,
        category,
        quantity,
        thumbnail: thumbnailImage.secure_url,
        images: uploadedImages,
    };
    const product = await Product.create(newProduct)
    if (!product) throw new ApiError("Error in creating product")
    return res.status(200)
        .json(new ApiResponse(200,
            product,
            "product created successfully"))
})



export { allProducts, postProduct }