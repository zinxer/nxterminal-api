import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import * as actionCodes from '../constants/actionCodes'
import * as errorCodes from '../constants/errorCodes'
import { changeUserPassword, getUserDetails } from '../services/userService';
import { insertLog } from '../services/logService'
import User from '../models/users';


export async function changePassword(req: Request, res: Response) {
    const user = (req as any).user
    const { currentPassword, newPassword } = req.body

    //check if current password is correct
    const userRow = await User.findOne({ where: { id: user.userId, isActive: true } })
    if (userRow) {
        if (!await bcrypt.compare(currentPassword, userRow.password)) {
            res.status(403).send({
                success: false,
                error: { code: errorCodes.ERROR_CODE_AUTHENTICATION_FAILED },
            });
            return
        }
        //check if new password is the same as current
        if (currentPassword === newPassword) {
            res.status(400).send({
                success: false,
                error: { error: errorCodes.ERROR_CODE_SAME_PASSWORD_USED }
            })
            return
        }

        if (!await changeUserPassword(user.userId, newPassword)) {
            res.status(400).json({ success: false, error: { code: errorCodes.ERROR_CODE_INVALID_PASSWORD_SPECS } });
            return;
        }
        // log change password action
        insertLog(user.userId, actionCodes.ACTION_CHANGE_PASSWORD, "User password changed successfully", req.clientIp || null)
        // Success
        res.json({
            success: true,
            message: "User password changed successfully."
        });
        return
    } else {
        res.status(400).json({ success: false, error: { code: errorCodes.ERROR_CODE_AUTHENTICATION_FAILED } });
        return;
    }
}

// get user account details
export async function getUser(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user.userId;

    if (!userId) {
        res.status(400).json({ success: false, error: { code: errorCodes.ERROR_CODE_AUTHENTICATION_FAILED } });
        return;
    }

    try {
        const userDetails = await getUserDetails(userId);
        if (!userDetails) {
            res.status(404).json({ success: false, error: { code: errorCodes.ERROR_CODE_AUTHENTICATION_FAILED } });
            return;
        }

        // log get user account details action
        insertLog(userId, actionCodes.ACTION_GET_USER_DETAILS, `Fetched details for user ${userId}`, req.clientIp || null);
        res.json({ success: true, data: userDetails, message: "User details fetched successfully." });
    } catch (error) {
        console.error("-E- Error fetching user details:", error);
        res.status(500).json({ success: false, error: { code: errorCodes.ERROR_CODE_SERVER_FAILED } });
    }
}