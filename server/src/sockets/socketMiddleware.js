import { verifyToken } from "../utils/generateToken.js";
import { userRepository } from "../repositories/userRepository.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = verifyToken(token);
    const user = await userRepository.findById(decoded.userId);

    if (!user) {
      return next(new Error("User not found"));
    }

    socket.user = user;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
};
