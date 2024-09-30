import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
    title: { type: String },
    description: { type: String },
    additionalInfo: { type: String },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    type: {
        type: String,
    },
    price: { type: Number, default: 0 },
    brand: { type: Schema.Types.ObjectId, ref: "Brand" },
    category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    images: [{ type: String }],
    thumbnail: { type: String },
    quantity: {
        type: Number,
        default: 0
    },
    isApproved: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Product = mongoose.model("Product", productSchema)

export { Product }
