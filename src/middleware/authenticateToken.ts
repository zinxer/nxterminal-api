import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/users'; // Assuming this is your Sequelize User model

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        res.sendStatus(401);
        return;
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, async (err, decoded) => {
        if (err) {
            res.sendStatus(403);
            return;
        }
        try {
            // Assuming 'decoded' contains a 'userId' field
            const user = await User.findOne({
                where: { id: (decoded as any).userId }
            });

            if (!user || !user.isActive) {
                res.sendStatus(403);
                return;
            }

            if (user) {
                const userSafeData = { ...user.get({ plain: true }) };
                delete userSafeData.password; // Exclude password or other sensitive fields
                delete userSafeData.refreshToken;
                delete userSafeData.isActive;
                delete userSafeData.createdAt;
                delete userSafeData.updatedAt;
                (req as any).user = userSafeData;
            }
            next();
        } catch (dbErr) {
            console.error(dbErr);
            res.sendStatus(500);
        }
    });
};
