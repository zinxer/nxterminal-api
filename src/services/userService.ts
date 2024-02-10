// src/services/userService.ts
import User from '../models/users';
import { generateUniqueId, generatePassword, hashPassword, isValidPassword } from '../utils/userHelpers';
import { mysqlDatetimeToEpoch } from '../utils/utils';

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

export async function getUserDetails(userId: string) {
    let user = await User.findOne({ where: { id: userId } });

    if (user) {
        return {
            id: user.id,
            isActive: user.isActive,
            createdAt: mysqlDatetimeToEpoch(user.createdAt)
        }
    } else {
        return null
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