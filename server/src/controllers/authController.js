import { authService } from "../services/authService.js";
import { successResponse } from "../utils/ApiResponse.js";

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return successResponse(res, result, 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user._id.toString());
    return successResponse(res, user);
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  getMe,
};
