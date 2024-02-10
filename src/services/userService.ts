// src/services/userService.ts
import User from '../models/users';
import { generateUniqueId, generatePassword, hashPassword } from '../utils/userHelpers';
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

    console.log(password, hashedPassword)

    const newUser = await User.create({
        id: userId,
        password: hashedPassword,
        isActive: true,
    });

    return { userId, password };
};

export async function getUserDetails(userId: string) {
    let user = await User.findOne({ where: { id: userId } });

    if (user) {

        return { id: user.id, isActive: user.isActive, createdAt: mysqlDatetimeToEpoch(user.createdAt) }
    } else {
        return null
    }
}