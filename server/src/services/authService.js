import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/userRepository.js";
import { generateToken } from "../utils/generateToken.js";

const SALT_ROUNDS = 12;

export const authService = {
  register: async ({ username, email, password }) => {
    const existing = await userRepository.findByEmailOrUsername(email, username);
    if (existing) {
      const field = existing.email === email ? "Email" : "Username";
      throw new Error(`${field} already in use`);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await userRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id.toString());

    return { user: user.toPublicJSON(), token };
  },

  login: async ({ email, password }) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken(user._id.toString());

    return { user: user.toPublicJSON(), token };
  },

  getMe: async (userId) => {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user.toPublicJSON();
  },
};
