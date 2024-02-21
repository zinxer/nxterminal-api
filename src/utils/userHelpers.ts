// src/utils/userHelpers.ts
import * as crypto from 'crypto';
import bcrypt from 'bcryptjs';

export const generateUniqueId = (): string => {
    return crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 8); // Generates an 8-character ID using slice instead of substr
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

export function isValidPassword(password: string): boolean {
    // Check for at least one letter and one number. Symbols are optional.
    // ^(?=.*[A-Za-z]) - Asserts that at least one letter exists
    // (?=.*\d) - Asserts that at least one digit exists
    // .{8,} - Asserts that the total length is at least 8 characters
    const regex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  
    return regex.test(password);
  }
