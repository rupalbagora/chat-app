import { userRepository } from "../repositories/userRepository.js";

export const userService = {
  getProfile: async (userId) => {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user.toPublicJSON();
  },

  updateProfile: async (userId, { username, bio, avatar }) => {
    if (username) {
      const existing = await userRepository.findByUsername(username);
      if (existing && existing._id.toString() !== userId) {
        throw new Error("Username already taken");
      }
    }

    const user = await userRepository.updateById(userId, {
      ...(username && { username }),
      ...(bio !== undefined && { bio }),
      ...(avatar !== undefined && { avatar }),
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user.toPublicJSON();
  },

  searchUsers: async (userId, query) => {
    if (!query || query.trim().length < 2) {
      return [];
    }
    const users = await userRepository.searchUsers(query.trim(), userId);
    return users.map((u) => u.toPublicJSON());
  },

  getUserById: async (userId) => {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user.toPublicJSON();
  },

  setOnline: async (userId, socketId) => {
    return userRepository.setOnlineStatus(userId, { online: true });
  },

  setOffline: async (userId) => {
    return userRepository.setOnlineStatus(userId, { online: false});
  },
};
