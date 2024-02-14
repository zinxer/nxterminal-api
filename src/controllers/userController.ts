import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import * as actionCodes from '../constants/actionCodes'
import * as errorCodes from '../constants/errorCodes'
import { changeUserPassword, getUserDetails, getUserSettings } from '../services/userService';
import { insertLog } from '../services/logService'
import User from '../models/users';
import UserSetting from '../models/user_settings';


export async function changePassword(req: Request, res: Response) {
    const userId = (req as any).user.id
    const { currentPassword, newPassword } = req.body

    //check if current password is correct
    const userRow = await User.findOne({ where: { id: userId, isActive: true } })
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

        if (!await changeUserPassword(userId, newPassword)) {
            res.status(400).json({ success: false, error: { code: errorCodes.ERROR_CODE_INVALID_PASSWORD_SPECS } });
            return;
        }
        // log change password action
        insertLog(userId, actionCodes.ACTION_CHANGE_PASSWORD, "User password changed successfully", req.clientIp || null)
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
    const userId = (req as any).user.id;

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

        const userSettings = await getUserSettings(userId);
        (userDetails as any)['settings'] = userSettings

        // log get user account details action
        insertLog(userId, actionCodes.ACTION_GET_USER_DETAILS, `Fetched details for user ${userId}`, req.clientIp || null);
        res.json({ success: true, data: userDetails, message: "User details fetched successfully." });
    } catch (error) {
        console.error("-E- Error fetching user details:", error);
        res.status(500).json({ success: false, error: { code: errorCodes.ERROR_CODE_SERVER_FAILED } });
    }
}

// set user theme settings
export async function setTheme(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user.id;
    const theme = req.params.theme;
    if (!userId) {
        res.status(400).json({ success: false, error: { code: errorCodes.ERROR_CODE_AUTHENTICATION_FAILED } });
        return;
    }

    if (!['classic', 'fresh', 'light'].includes(theme)) {
        res.status(400).json({ success: false, error: { code: errorCodes.ERROR_CODE_INVALID_PARAMS } });
        return;
    }

    try {
        // Use upsert to either update existing theme setting or insert a new one
        await UserSetting.upsert({
            userId: userId,
            settingKey: 'theme',
            settingValue: theme,
        });

        // log get user setting
        insertLog(userId, actionCodes.ACTION_SET_USER_THEME, `Set theme: ${theme} for user ${userId}`, req.clientIp || null);
        res.json({ success: true, data: { theme: theme } });
    } catch (error) {
        console.error("-E- Error settings user theme:", error);
        res.status(500).json({ success: false, error: { code: errorCodes.ERROR_CODE_SERVER_FAILED } });
    }

}