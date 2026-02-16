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

export const ReplaceNote = async (inputs) => {

}