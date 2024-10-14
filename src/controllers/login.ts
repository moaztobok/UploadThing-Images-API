import jwt from "jsonwebtoken";
import { Request, Response } from "express";

export const login = async (req: Request, res: Response) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({ message: 'Invalid request' });
    } else if (req.body.username === process.env.ADMIN_USERNAME && req.body.password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign(
            { username: req.body.username },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};
