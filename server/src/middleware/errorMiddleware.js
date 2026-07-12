import { logger } from "../utils/logger.js";

const clientErrors = [
  "Invalid email or password",
  "Email already in use",
  "Username already taken",
  "Username already in use",
  "User not found",
  "Message not found",
  "Not authorized",
  "Not authorized to edit this message",
  "Not authorized to delete this message",
  "Cannot send message to yourself",
  "Reply message not found",
  "Cannot edit a deleted message",
  "Sender or receiver not found",
];

export const errorMiddleware = (err, req, res, next) => {
  logger.error(err.message);

  let statusCode = err.statusCode || 500;
  if (clientErrors.includes(err.message)) {
    statusCode = 400;
  }
  const message =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "Internal server error"
      : err.message;

  res.status(statusCode).json({
    success: false,
    message,
  });
};
