// src/utils/userHelpers.ts
import * as crypto from 'crypto';
import bcrypt from 'bcryptjs';

export const generateUniqueId = (): string => {
    return crypto.randomBytes(4).toString('hex').toUpperCase().substr(0, 8); // Generates an 8-character ID
};

export const generatePassword = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};
