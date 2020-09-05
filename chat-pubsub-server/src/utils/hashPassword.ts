import argon2 from "argon2";

async function hashPassword(password: string) {
  try {
    const hash = await argon2.hash(password);
    return hash;
  } catch (error) {
    return error;
  }
}

export default hashPassword;
