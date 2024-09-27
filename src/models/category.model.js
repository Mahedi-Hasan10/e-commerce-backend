import mongoose, { Schema } from "mongoose";

const categorySchma = new Schema({
    name: { type: String, required: true, unique: true }
})
const brandSchema = new Schema({
    name: { type: String, required: true, unique: true }
})

const Category = mongoose.model("Category", categorySchma)
const Brand = mongoose.model("Brand", brandSchema)

export { Category, Brand }