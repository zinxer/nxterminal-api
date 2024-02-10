import { Request, Response } from 'express';
import * as actionCodes from '../constants/actionCodes'
import * as errorCodes from '../constants/errorCodes'
import { getUserDetails } from '../services/userService';
import { insertLog } from '../services/logService'

export function changePassword(req: Request, res: Response) {
    const user = (req as any).user
    
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

        insertLog(userId, actionCodes.ACTION_GET_USER_DETAILS, `Fetched details for user ${userId}`, req.clientIp ?? '');

        // Depending on what userDetails contains, you might want to filter out sensitive information before sending it back
        res.json({ success: true, data: userDetails, message: "User details fetched successfully." });
    } catch (error) {
        console.error("-E- Error fetching user details:", error);
        res.status(500).json({ success: false, error: { code: errorCodes.ERROR_CODE_SERVER_FAILED } });
    }
}