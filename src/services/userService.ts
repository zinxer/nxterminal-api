// src/services/userService.ts
import User from '../models/users';
import { generateUniqueId, generatePassword, hashPassword } from '../utils/userHelpers';

export const createUniqueUser = async () => {
    let uniqueId = generateUniqueId();
    let userExists = await User.findOne({ where: { id: uniqueId } });

    while (userExists) {
        uniqueId = generateUniqueId();
        userExists = await User.findOne({ where: { id: uniqueId } });
    }

    const password = generatePassword();
    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
        id: uniqueId,
        password: hashedPassword,
        isActive: true,
    });

    return { newUser, password };
};
