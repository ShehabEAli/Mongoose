import mongoose from "mongoose";
import { NoteModel } from "../../DB/model/note.model.js"
import { UserModel } from "../../DB/model/user.model.js"


export const createNote = async (body, userId) => {
    const { title, content } = body;

    const user = await UserModel.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    const note = await NoteModel.create({
        title,
        content,
        userId
    });

    return note;
}

export const updateNote = async (noteId, body, userId) => {
    const { title, content } = body;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
        throw new Error("Invalid note ID");
    }

    const note = await NoteModel.findById(noteId);
    if (!note) {
        throw new Error("Note not found");
    }

    if (!note.userId.equals(userId)) {
        throw new Error("You are not the owner");
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;

    await note.save();
    return note;
};

export const replaceNote = async (body, _id, userId) => {
    const { title, content } = body;

    const replaced = await NoteModel.findOneAndReplace(
        { _id, userId: new mongoose.Types.ObjectId(userId) },
        {
            title,
            content,
            userId
        },
        { new: true }
    );

    if (!replaced) {
        throw new Error("Note not found or You are not the owner");
    }

    return replaced;
};

export const UpdateAllTitle = async (body, userId) => {
    const { title } = body;
    const user = await UserModel.findById(userId);
    if (!user) {
        throw new Error("you are not the owner");
    }

    const notes = await NoteModel.updateMany({}, { $set: { title } })
    return notes
}

export const deleteNote = async (_id, userId) => {

    // 2) find note first
    const note = await NoteModel.findById(_id);
    if (!note) {
        throw new Error("Note not found");
    }

    // 3) ownership check
    if (note.userId.toString() !== userId.toString()) {
        throw new Error("You are not the owner");
    }

    // 4) delete
    await NoteModel.deleteOne({ _id });

    return { message: "Note deleted successfully" };
}

export const getPaginatedNotes = async (query, userId) => {
    let { page = 1, limit = 10 } = query;

    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const Object_userId = new mongoose.Types.ObjectId(userId);

    // const totalNotes = await NoteModel.countDocuments({ userId: Object_userId });
    // console.log("total notes for user:", totalNotes);

    const notes = await NoteModel.find({ userId: Object_userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    // console.log("notes returned:", notes);
    return notes;
}

export const getById = async (_id, userId) => {

    const note = await NoteModel.findById(_id);
    if (!note) {
        throw new Error("Note not found");
    }

    if (note.userId.toString() !== userId.toString()) {
        throw new Error("You are not the owner");
    }
    return note
}

export const getByContent = async (content, userId) => {

    const note = await NoteModel.findOne({ content });
    if (!note) {
        throw new Error("Note not found");
    }

    if (note.userId.toString() !== userId.toString()) {
        throw new Error("You are not the owner");
    }
    return note
}

export const getNotesWithUser = async (userId) => {
    const notes = await NoteModel.find({ userId })
        .select("title userId createdAt")
        .populate({
            path: "userId",
            select: "email"
        });

    return notes;
}

export const aggregateNotes = async (userId, title) => {

    const matchStage = {
        userId: new mongoose.Types.ObjectId(userId)
    };

    if (title) {
        matchStage.title = { $regex: title, $options: "i" }; 
    }

    const notes = await NoteModel.aggregate([

        { $match: matchStage },

        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },

        { $unwind: "$user" },

        {
            $project: {
                title: 1,
                userId: 1,
                createdAt: 1,
                "user.name": 1,
                "user.email": 1
            }
        }

    ]);

    return notes;
};

export const deleteAll = async (userId) => {

    const result = await NoteModel.deleteMany(userId);
    console.log(result);

    if (result.deletedCount === 0) {
        throw new Error("You don't have any notes");
    }

    return { message: "Notes deleted successfully" };
}