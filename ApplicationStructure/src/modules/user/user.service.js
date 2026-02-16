import { UserModel } from '../../DB/model/index.js'

export const updateUser = async (userId, inputs) => {

    const user = await UserModel.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    if (inputs.email && inputs.email !== user.email) {
        const isExist = await UserModel.findOne({ email: inputs.email });
        if (isExist) {
            throw new Error("Email already exists");
        }
    }

    delete inputs.password;

    await UserModel.updateOne({ _id: userId }, inputs);

    return { message: "User updated" };
};

export const deleteUser = async (userId) => {

    const user = await UserModel.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    await UserModel.deleteOne({ _id: userId });

    return { message: "User Deleted" };
};

export const getUser = async (userId) => {
    const user = await UserModel.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    return user ;
};