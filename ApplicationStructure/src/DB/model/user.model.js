import mongoose from "mongoose";

export const users = []

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, lowercase: true, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number, min: 18, max: 60 }

}, {
    timestamps: true
})

export const UserModel = mongoose.model('User', userSchema);