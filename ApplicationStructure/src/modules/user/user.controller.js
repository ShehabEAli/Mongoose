import { Router } from "express";
import { deleteUser, getUser, updateUser } from "./user.service.js";
import { auth } from "../auth/auth.middleware.js";


const router = Router()

router.patch("", auth, async (req, res, next) => {
    try {
        const result = await updateUser(req.userId, req.body);
        res.json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
})

router.delete("", auth, async (req, res, next) => {
    const result = await deleteUser(req.userId)
    return res.status(201).json(result)
})

router.get("", auth, async (req, res, next) => {
    const result = await getUser(req.userId)
    return res.status(201).json(result)
})

export default router