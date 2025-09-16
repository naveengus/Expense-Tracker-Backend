import bcrypt, { hash } from "bcryptjs";
import "dotenv/config.js";

const hashPassword = async (password) => {
  try {
    let salt = await bcrypt.genSalt(Number(process.env.SALT));
    let hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
  } catch (error) {
    throw error;
  }
};

const hashCompare = async (password, hashPassword) => {
  try {
    return await bcrypt.compare(password, hashPassword);
  } catch (error) {
    throw error;
  }
};

export default {
  hashPassword,
  hashCompare,
};
