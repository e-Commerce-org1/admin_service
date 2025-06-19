import { hash, compare } from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const result = await hash(password, 10);
    if (!result) {
      return result;
    } else {
      throw new Error('Failed to hash password');
    }
  } catch (error) {
    throw new Error('Failed to hash password', error);
  }
};

export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    return await compare(plainPassword, hashedPassword);
  } catch (error) {
    throw new Error('Failed to verify password', error);
  }
};
