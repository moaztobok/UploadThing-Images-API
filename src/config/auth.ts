import express from 'express';
import jwt from 'jsonwebtoken';

export const authenticateJWT = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!process.env.JWT_SECRET) {
        return res.status(500).json
    }
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            // req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};