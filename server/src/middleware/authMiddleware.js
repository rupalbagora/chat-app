import { verifyToken } from "../utils/generateToken.js";
import { userRepository } from "../repositories/userRepository.js";
import { errorResponse } from "../utils/ApiResponse.js";

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      return errorResponse(res, "Unauthorized", 401);
    }

    const token = header.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await userRepository.findById(decoded.userId);

    if (!user) {
      return errorResponse(res, "User not found", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, "Invalid or expired token", 401);
  }
};

export default authMiddleware;
