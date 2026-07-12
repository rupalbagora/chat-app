import { messageService } from "../services/messageService.js";
import { successResponse } from "../utils/ApiResponse.js";

export const sendMessage = async (req, res, next) => {
  try {
    const message = await messageService.sendMessage({
      senderId: req.user._id.toString(),
      receiverId: req.body.receiverId,
      text: req.body.text,
      type: req.body.type,
      replyTo: req.body.replyTo,
    });
    return successResponse(res, message, 201);
  } catch (error) {
    next(error);
  }
};

export const getConversation = async (req, res, next) => {
  try {
    const messages = await messageService.getConversation(
      req.user._id.toString(),
      req.params.userId,
      {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 50,
      }
    );
    return successResponse(res, messages);
  } catch (error) {
    next(error);
  }
};

export const getRecentConversations = async (req, res, next) => {
  try {
    const conversations = await messageService.getRecentConversations(
      req.user._id.toString()
    );
    return successResponse(res, conversations);
  } catch (error) {
    next(error);
  }
};

export const searchMessages = async (req, res, next) => {
  try {
    const messages = await messageService.searchMessages(
      req.user._id.toString(),
      req.query.q
    );
    return successResponse(res, messages);
  } catch (error) {
    next(error);
  }
};

export const editMessage = async (req, res, next) => {
  try {
    const message = await messageService.editMessage(
      req.user._id.toString(),
      req.params.id,
      req.body.text
    );
    return successResponse(res, message);
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const message = await messageService.deleteMessage(
      req.user._id.toString(),
      req.params.id
    );
    return successResponse(res, message);
  } catch (error) {
    next(error);
  }
};

export const markSeen = async (req, res, next) => {
  try {
    const message = await messageService.markSeen(
      req.user._id.toString(),
      req.params.id
    );
    return successResponse(res, message);
  } catch (error) {
    next(error);
  }
};
