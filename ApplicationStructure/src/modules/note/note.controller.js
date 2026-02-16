import { Router } from 'express'
import { auth } from '../auth/auth.middleware.js';
import { createNote, updateNote } from './note.service.js';
const router = Router();


router.post("", auth, async (req, res, next) => {
    const result = await createNote(req.body, req.userId)
    return res.status(201).json({ message: "Note Created", result })
})

router.patch("/:noteId", auth, async (req, res, next) => {
    try {
        const noteId = req.params.noteId;       
        const userId = req.userId;             
        const body = req.body;

        console.log(userId)
        const updatedNote = await updateNote(noteId, body, userId);
        res.status(200).json({message: "updated",note: updatedNote});
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

router.put("/replace/:noteId", auth, async (req, res, next) => {
    const result = await ReplaceNote(req.body, req.userId)
    return res.status(201).json(result)
})

router.patch("/all", auth, async (req, res, next) => {
    const result = await login(req.body)
    return res.status(201).json(result)
})

router.delete("/:noteId", auth, async (req, res, next) => {
    const result = await login(req.body)
    return res.status(201).json(result)
})

router.get("/paginate-sort", auth, async (req, res, next) => {
    const result = await login(req.body)
    return res.status(201).json(result)
})

router.get("/:id", auth, async (req, res, next) => {
    const result = await login(req.body)
    return res.status(201).json(result)
})

router.get("/note-by-content", auth, async (req, res, next) => {
    const result = await login(req.body)
    return res.status(201).json(result)
})

router.get("/note-with-user", auth, async (req, res, next) => {
    const result = await login(req.body)
    return res.status(201).json(result)
})

router.get("/aggregate", auth, async (req, res, next) => {
    const result = await login(req.body)
    return res.status(201).json(result)
})

router.delete("", auth, async (req, res, next) => {
    const result = await login(req.body)
    return res.status(201).json(result)
})

export default router