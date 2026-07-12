import mongoose from "mongoose";
import { Message } from "../models/Message.js";

const toObjectId = (id) => new mongoose.Types.ObjectId(id);

export const messageRepository = {
  findById: (id) =>
    Message.findById(id)
      .populate("sender", "username avatar")
      .populate("receiver", "username avatar")
      .populate({
        path: "replyTo",
        populate: {
          path: "sender",
          select: "username avatar",
        },
      }),

  create: (data) =>
    Message.create(data).then((msg) =>
      Message.findById(msg._id)
        .populate("sender", "username avatar")
        .populate("receiver", "username avatar")
        .populate({
          path: "replyTo",
          populate: {
            path: "sender",
            select: "username avatar",
          },
        }),
    ),

  updateById: (id, data) =>
    Message.findByIdAndUpdate(id, data, { new: true })
      .populate("sender", "username avatar")
      .populate("receiver", "username avatar")
      .populate({
        path: "replyTo",
        populate: {
          path: "sender",
          select: "username avatar",
        },
      }),

  softDelete: (id) =>
    Message.findByIdAndUpdate(
      id,
      { deleted: true, text: "This message was deleted" },
      { new: true },
    ),

  findConversation: (userId, partnerId, { page = 1, limit = 50 } = {}) => {
    const skip = (page - 1) * limit;
    return Message.find({
      $or: [
        { sender: userId, receiver: partnerId },
        { sender: partnerId, receiver: userId },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("sender", "username avatar")
      .populate("receiver", "username avatar")
      .populate({
        path: "replyTo",
        populate: {
          path: "sender",
          select: "username avatar",
        },
      })
      .lean();
  },

  searchMessages: (userId, query) =>
    Message.find({
      $text: { $search: query },
      $or: [{ sender: userId }, { receiver: userId }],
      deleted: { $ne: true },
    })
      .sort({ score: { $meta: "textScore" } })
      .limit(50)
      .populate("sender receiver", "username avatar"),

  getRecentConversations: async (userId) => {
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: toObjectId(userId) },
            { receiver: toObjectId(userId) },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", toObjectId(userId)] },
              "$receiver",
              "$sender",
            ],
          },
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$receiver", toObjectId(userId)] },
                    { $eq: ["$seen", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { "lastMessage.createdAt": -1 } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "partner",
        },
      },
      { $unwind: "$partner" },
      {
        $project: {
          partner: {
            _id: 1,
            username: 1,
            avatar: 1,
            online: 1,
            lastSeen: 1,
          },
          lastMessage: 1,
          unreadCount: 1,
        },
      },
    ]);

    return messages;
  },

  // markConversationSeen: (userId, partnerId) =>
  //   Message.updateMany(
  //     {
  //       sender: partnerId,
  //       receiver: userId,
  //       seen: false,
  //     },
  //     { seen: true, status: "seen" }
  //   ),
  markConversationSeen: async (userId, partnerId) => {
    await Message.updateMany(
      {
        sender: partnerId,
        receiver: userId,
        seen: false,
      },
      {
        seen: true,
        status: "seen",
      },
    );

    return Message.find({
      sender: partnerId,
      receiver: userId,
      seen: true,
    }).populate("sender receiver", "username avatar");
  },
  markDelivered: (messageId) =>
    Message.findByIdAndUpdate(
      messageId,
      { delivered: true, status: "delivered" },
      { new: true },
    ),
};
