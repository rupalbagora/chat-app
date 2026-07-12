import { userService } from "../services/userService.js";
import { successResponse } from "../utils/ApiResponse.js";

const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user._id.toString());
    return successResponse(res, user);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(
      req.user._id.toString(),
      req.body,
    );
    return successResponse(res, user);
  } catch (error) {
    next(error);
  }
};

const searchUsers = async (req, res, next) => {
  try {
    const users = await userService.searchUsers(
      req.user._id.toString(),
      req.query.q,
    );
    return successResponse(res, users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return successResponse(res, user);
  } catch (error) {
    next(error);
  }
};

const userController = {
  getProfile,
  updateProfile,
  searchUsers,
  getUserById,
};

export default userController;
