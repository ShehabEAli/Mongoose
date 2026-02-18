import { Router } from 'express'
import { auth } from '../auth/auth.middleware.js';
import { createNote, deleteNote, replaceNote, UpdateAllTitle, updateNote, getPaginatedNotes, getById, getByContent, getNotesWithUser, deleteAll, aggregateNotes } from './note.service.js';
const router = Router();


router.post("", auth, async (req, res, next) => {
    const result = await createNote(req.body, req.userId)
    return res.status(201).json({ message: "Note Created", result })
})

router.put("/replace/:noteId", auth, async (req, res, next) => {
    const result = await replaceNote(req.body, req.params.noteId, req.userId)
    return res.status(201).json(result)
})

router.patch("/all", auth, async (req, res, next) => {
    const result = await UpdateAllTitle(req.body, req.userId);
    return res.status(201).json(result)
})

router.patch("/:noteId", auth, async (req, res, next) => {
    try {
        const noteId = req.params.noteId;
        const userId = req.userId;
        const body = req.body;

        console.log(userId)
        const updatedNote = await updateNote(noteId, body, userId);
        res.status(200).json({ message: "updated", note: updatedNote });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

router.delete("/:noteId", auth, async (req, res, next) => {
    const result = await deleteNote(req.params.noteId, req.userId)
    return res.status(201).json({ message: "deleted", result })
})

router.get("/paginate-sort", auth, async (req, res, next) => {
    const result = await getPaginatedNotes(req.query, req.userId)
    return res.status(201).json(result)
})

router.get("/note-by-content", auth, async (req, res, next) => {
    const result = await getByContent(req.query.content, req.userId)
    return res.status(201).json(result)
})

router.get("/note-with-user", auth, async (req, res, next) => {
    const result = await getNotesWithUser(req.userId)
    return res.status(201).json(result)
})

router.get("/aggregate", auth, async (req, res, next) => {
    const result = await aggregateNotes(req.userId, req.query.title)
    return res.status(201).json(result)
})

router.delete("", auth, async (req, res, next) => {
    const result = await deleteAll(req.body)
    return res.status(201).json(result)
})

router.get("/:id", auth, async (req, res, next) => {
    const result = await getById(req.params.id, req.userId)
    return res.status(201).json(result)
})
export default router