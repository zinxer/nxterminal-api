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

export async function changeUserPassword(userId: string, newPassword: string) {
    //check if new password is of valid type
    if (isValidPassword(newPassword)) {
        const hashedPassword = await hashPassword(newPassword);
        if (await User.update({ password: hashedPassword }, { where: { id: userId } })) {
            return true
        }
    }
    return false
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