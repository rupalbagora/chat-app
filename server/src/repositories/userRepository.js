import { User } from "../models/User.js";

export const userRepository = {
  findById: (id) => User.findById(id),

  findByIdWithPassword: (id) => User.findById(id).select("+password"),

  findByEmail: (email) => User.findOne({ email }).select("+password"),

  findByUsername: (username) => User.findOne({ username }),

  findByEmailOrUsername: (email, username) =>
    User.findOne({ $or: [{ email }, { username }] }),

  create: (data) => User.create(data),

  updateById: (id, data) =>
    User.findByIdAndUpdate(id, data, { new: true }),

  searchUsers: (query, excludeId) =>
    User.find({
      _id: { $ne: excludeId },
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).limit(20),

  setOnlineStatus: (id, { online}) =>
    User.findByIdAndUpdate(
      id,
      {
        online,
        // socketId,
        lastSeen: online ? undefined : new Date(),
      },
      { new: true }
    ),

  // findBySocketId: (socketId) => User.findOne({ socketId }),
};
