import { Request, Response } from 'express';
import { insertLog } from '../services/logService'
import * as actionCodes from '../constants/actionCodes'
import { createUniqueUser, getUserDetails, resetNewUserPassword, getTradeAccount, createTradeAccount } from '../services/userService';

// create user account
export async function createUser(req: Request, res: Response): Promise<void> {
    try {
        const { userId, password } = await createUniqueUser();

        // check if user already has trade accounts generated in trade_account table if not create one
        const tradeAccount = await getTradeAccount(userId, 'USD');
        if (!tradeAccount) {
            await createTradeAccount(userId, 'USD');
        }

        // Log broker create user account action
        insertLog('broker', actionCodes.ACTION_CREATE_USER, `Created user account ${userId}`, req.clientIp || null)
        // Implement secure password transmission to the user here
        res.json({ success: true, data: { user: userId, password: password }, message: "User account created successfully." });
    } catch (error) {
        console.error("-E- Error creating user:", error);
        res.status(500).json({ success: false, message: "An error occurred while creating the user." });
    }
}

// get user account details
export async function getUser(req: Request, res: Response): Promise<void> {
    const userId = req.params.userId; // Assuming you're using a URL parameter to identify the user
    if (!userId) {
        res.status(400).json({ success: false, message: "Invalid userId." });
        return;
    }

    try {
        const userDetails = await getUserDetails(userId);
        if (!userDetails) {
            res.status(404).json({ success: false, message: "User not found." });
            return;
        }

        // check if user already has trade accounts generated in trade_account table if not create one
        const tradeAccount = await getTradeAccount(userId, 'USD');
        if (!tradeAccount) {
            await createTradeAccount(userId, 'USD');
        }

        // Log broker get user details action
        insertLog('broker', actionCodes.ACTION_GET_USER_DETAILS, `Fetched details for user ${userId}`, req.clientIp || null);

        // Depending on what userDetails contains, you might want to filter out sensitive information before sending it back
        res.json({ success: true, data: userDetails, message: "User details fetched successfully." });
    } catch (error) {
        console.error("-E- Error fetching user details:", error);
        res.status(500).json({ success: false, message: "An error occurred while fetching the user details." });
    }
}

export async function resetUserPassword(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    if (!userId) {
        res.status(400).json({ success: false, message: "Invalid userId." });
        return;
    }

    try {
        const newPassword = await resetNewUserPassword(userId)
        if (!newPassword) {
            res.status(400).json({
                success: false,
                message: `Failed to reset password, please check if '${userId}' exists.`
            })
            return
        }
        // Log broker create user account action
        insertLog('broker', actionCodes.ACTION_RESET_PASSWORD, `Reset user password ${userId}`, req.clientIp || null)
        // Implement secure password transmission to the user here
        res.json({ success: true, data: { user: userId, password: newPassword }, message: "User password reset successfully." });
    } catch (error) {
        console.error("-E- Error resetting user password:", error);
        res.status(500).json({ success: false, message: `An error occurred while resetting password for user '${userId}'` });
    }
}