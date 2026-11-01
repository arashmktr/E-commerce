import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export const hashPassword = (plainPassword) => bcrypt.hash(plainPassword, SALT_ROUNDS);

export const verifyPassword = (plainPassword, hashedPassword) =>
  bcrypt.compare(plainPassword, hashedPassword);
