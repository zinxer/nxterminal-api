// src/services/userService.ts
import User from '../models/users';
import TradeAccount from '../models/trade_accounts';
import UserSetting from '../models/user_settings';
import { generateUniqueId, generatePassword, hashPassword, isValidPassword } from '../utils/userHelpers';
import { mysqlDatetimeToEpoch, generateTradeAccountId } from '../utils/utils';

export async function createUniqueUser() {
    let userId = generateUniqueId();
    let userExists = await User.findOne({ where: { id: userId } });

    while (userExists) {
        userId = generateUniqueId();
        userExists = await User.findOne({ where: { id: userId } });
    }

    const password = generatePassword();
    const hashedPassword = await hashPassword(password);
    await User.create({
        id: userId,
        password: hashedPassword,
        isActive: true,
    });

    return { userId, password };
};

export async function changeUserPassword(userId: string, newPassword: string): Promise<boolean> {
    // Check if new password is of valid type
    if (isValidPassword(newPassword)) {
        const hashedPassword = await hashPassword(newPassword);
        // Attempt to update the user's password
        const [updatedRows] = await User.update({ password: hashedPassword }, { where: { id: userId } });
        if (updatedRows > 0) {
            return true; // Indicates that the update operation affected at least one row
        }
    }
    return false; // Returns false if the password is not valid or no rows were updated
}

export async function resetNewUserPassword(userId: string) {
    const password = generatePassword();
    const hashedPassword = await hashPassword(password);
    // Attempt to update the user's password
    const [updatedRows] = await User.update({ password: hashedPassword }, { where: { id: userId } });
    if (updatedRows > 0) {
        return password; // Indicates that the update operation affected at least one row
    }
    return null
}

export async function getUserDetails(userId: string, extend: Boolean = true) {
    let user = extend ? await User.findOne({ where: { id: userId }, include: TradeAccount }) : await User.findOne({ where: { id: userId } });

    let modifiedResponse = {}
    if (user) {
        modifiedResponse = {
            id: user.id,
            isActive: user.isActive,
            createdAt: mysqlDatetimeToEpoch(user.createdAt)
        }
    } else {
        return null
    }

    if (extend) {
        (user as any).TradeAccounts.forEach((account: TradeAccount) => {
            const currency = account.currency as string;
            (modifiedResponse as any)[currency] = {
                tradeAccId: account.id,
                balance: account.balance,
                createdAt: mysqlDatetimeToEpoch(account.createdAt),
                updatedAt: mysqlDatetimeToEpoch(account.updatedAt)
            }

        });
    }
    return modifiedResponse
}

export async function getUserSettings(userId: string): Promise<{ [key: string]: any } | null> {
    const settings = await UserSetting.findAll({
        where: { userId: userId },
    });

    if (settings && settings.length > 0) {
        const settingsObject: { [key: string]: any } = {};
        settings.forEach(setting => {
            try {
                // Attempt to parse the settingValue as JSON
                settingsObject[setting.settingKey] = JSON.parse(setting.settingValue);
            } catch (error) {
                // If parsing fails, it means settingValue is not a valid JSON string,
                // so we assign it directly as a string
                settingsObject[setting.settingKey] = setting.settingValue;
            }
        });
        return settingsObject;
    } else {
        return {};
    }
}

export async function updateUserWithRefreshToken(userId: string, refreshToken: string) {
    try {
        let user = await User.findOne({ where: { id: userId, isActive: true } })
        if (user) {
            user.set('refreshToken', refreshToken)
            await user.save()
            return user
        }
    } catch (error) {
        console.log("-E-", error)
    }
    return null
}

export function getTradeAccount(userId: string, currency: string) {
    return TradeAccount.findOne({ where: { userId: userId, currency: currency } });
}

export async function createTradeAccount(userId: string, currency: string = 'USD') {
    // Assign id as the first 6 characters of md5 hash of userId and epoch time, and regenerate if it already exists in the database
    const id = generateTradeAccountId(userId, currency)
    const tradeAccount = TradeAccount.findOne({ where: { id: id } });
    // If the trade account already exists, keep egenerating the id and check again until it is unique:
    if (await tradeAccount) {
        return createTradeAccount(userId);
    }

    return TradeAccount.create({ userId: userId, id: id, balance: '0', currency: currency });
}
