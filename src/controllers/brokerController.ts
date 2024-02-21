import { Request, Response } from 'express';
import { insertLog } from '../services/logService'
import * as actionCodes from '../constants/actionCodes'
import { createUniqueUser, getUserDetails, resetNewUserPassword, getTradeAccount, createTradeAccount } from '../services/userService';
import TradeAccount from '../models/trade_accounts';
import FinancialTransaction from '../models/financial_transactions';


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

    try {
        const userDetails = await getUserDetails(userId, true);
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


export async function getFinanceTxns(req: Request, res: Response): Promise<void> {
    const { currency, userId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    let queryOptions: any = {
        where: {},
        limit,
        offset,
        order: [['createdAt', 'DESC']]
    };

    // set a limit of 1000 to avoid fetching too many records
    if (limit > 1000) {
        res.status(400).json({ success: false, message: "Limit too high. Maximum limit is 1000." });
        return;
    }

    if (currency) {
        queryOptions.where.currency = currency;
    }

    // if userId is provided then fetch transactions for that user which includes all trade accounts of that user
    if (userId) {
        //find the trade accounts for the user
        const tradeAccounts = await TradeAccount.findAll({ where: { userId } });
        if (tradeAccounts.length === 0) {
            res.status(404).json({ success: false, message: "User not found." });
            return;
        }
        queryOptions.where.tradeAccId = tradeAccounts.map((acc: any) => acc.id);
    }
    try {
        const financeTxns = await FinancialTransaction.findAndCountAll(queryOptions);

        // change createdAt to epoch and remove updatedAt
        (financeTxns as any).rows = financeTxns.rows.map((txn: any) => {
            return {
                id: txn.id,
                tradeAccId: txn.tradeAccId,
                type: txn.type,
                amount: txn.amount,
                currency: txn.currency,
                status: txn.status,
                datetime: txn.createdAt.getTime()
            }
        });

        // Log broker get financial transactions action, with currency if provided and userId if provided
        let logParams = currency ? `currency ${currency}` : userId ? `userId ${userId}` : 'all';
        insertLog('broker', actionCodes.ACTION_GET_FINANCE_TXNS, `Fetched financial transactions for ${logParams}`, req.clientIp || null);

        res.json({ success: true, data: financeTxns, message: "Financial transactions fetched successfully." });
    } catch (error) {
        console.error("-E- Error fetching financial transactions:", error);
        res.status(500).json({ success: false, message: "An error occurred while fetching the financial transactions." });
    }
}
