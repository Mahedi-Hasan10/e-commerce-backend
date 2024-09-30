import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const allProducts = asyncHandler(async (req, res) => {
    const { category, brand, title } = req.query;
    let query = {};
    if (category) {
        const categoriesArray = Array.isArray(category) ? category : [category];
        query.category = { $in: categoriesArray.map(cat => new mongoose.Types.ObjectId(cat)) };
    }
    if (brand) {
        query.brand = new mongoose.Types.ObjectId(brand);
    }
    if (title) {
        query.title = { $regex: title, $options: 'i' };
    }
    const products = await Product.find(query).select("-__v -additionalInfo -description");
    if (!products || products.length === 0) throw new ApiError(404, "No products found");
    return res.status(200)
        .json(new ApiResponse(200, products, "Products fetched successfully"));
});
const singleProduct = asyncHandler(async (req, res) => {
    const id = req.query.id;
    console.log("🚀 ~ singleProduct ~ id:", id)
    if (!id) {
        throw new ApiError(400, "No product ID found");
    }

    const product = await Product.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(id),
            },
        },
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "categories",
            },
        },
        {
            $lookup: {
                from: "brands",
                localField: "brand",
                foreignField: "_id",
                as: "brand",
            },
        },
        {
            $unwind: {
                path: "$brand",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $project: {
                __v: 0,
                "categories.__v": 0,
                "brand.__v": 0,
                "category": 0
            },
        },
    ]);

    if (!product || product.length === 0) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(new ApiResponse(200, product[0], "Product fetched successfully"));
});
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

const updateProduct = asyncHandler(async (req, res) => {
    const id = req.query.id;
    const { title, description, additionalInfo, type, price, brand, category, quantity } = req.body;
    if (!id) {
        throw new ApiError(400, "Product ID is required");
    }
    const product = await Product.findById(id);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    let thumbnailImage = product.thumbnail;
    if (req?.files?.thumbnail?.[0]?.path) {
        const thumbnailLocalImagePath = req.files.thumbnail[0].path;
        const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalImagePath);
        if (!uploadedThumbnail) throw new ApiError(401, "Error uploading thumbnail");
        thumbnailImage = uploadedThumbnail.secure_url;
    }

    let uploadedImages = product.images;
    if (req?.files?.images) {
        uploadedImages = [];
        for (const image of req.files.images) {
            let result = await uploadOnCloudinary(image.path);
            if (!result) throw new ApiError("Error uploading image");
            uploadedImages.push(result.secure_url);
        }
    }

    const updatedProductData = {
        title: title || product.title,
        description: description || product.description,
        additionalInfo: additionalInfo || product.additionalInfo,
        type: type || product.type,
        price: price || product.price,
        brand: brand || product.brand,
        category: category || product.category,
        quantity: quantity || product.quantity,
        thumbnail: thumbnailImage,
        images: uploadedImages,
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedProductData, { new: true });

    if (!updatedProduct) {
        throw new ApiError(500, "Error updating product");
    }
    return res.status(200)
        .json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
});

export { allProducts, postProduct, singleProduct, updateProduct }