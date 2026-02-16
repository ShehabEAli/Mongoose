import { UserModel } from "../../DB/model/user.model.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const signup = async (inputs) => {
    const { name, email, password, phone, age } = inputs

    const isExist = await UserModel.findOne({ email });
    if (isExist) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ name, email, password: hashedPassword, phone, age })
    await user.save()
    return { message: "User added successfully" }
}

export const login = async (inputs) => {
    const { email, password } = inputs
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new Error("Invalid Email");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new Error("Invalid password");
    }

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return {
        message: "Login successful",
        token
    };
}

