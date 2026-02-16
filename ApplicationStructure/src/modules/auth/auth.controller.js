import { Router } from 'express'
import { login, signup } from './auth.service.js';
const router = Router();

router.post("/signup", async (req, res, next) => {
    try {
        const result = await signup(req.body);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

router.post("/login", async (req, res, next) => {
    const result = await login(req.body)
    return res.status(201).json( result )
})


export default router