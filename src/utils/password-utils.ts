import { hash, compare } from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const result = await hash(password, 10);
    return result
  } catch (error) {
    throw new Error('Failed to hash password', error);
  }
};

export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
     if (!plainPassword || !hashedPassword) {
    return false;
  }
    return await compare(plainPassword, hashedPassword);
  } catch (error) {
    throw new Error('Failed to verify password', error);
  }
};
