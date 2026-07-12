import { body } from "express-validator";
import { MESSAGE_TYPE } from "../constants/index.js";

export const sendMessageValidator = [
  body("receiverId").isMongoId().withMessage("Valid receiver ID is required"),
  body("text")
    .trim()
    .notEmpty()
    .withMessage("Message text is required")
    .isLength({ max: 5000 })
    .withMessage("Message too long"),
  body("type")
    .optional()
    .isIn(Object.values(MESSAGE_TYPE))
    .withMessage("Invalid message type"),
  body("replyTo")
    .optional({ nullable: true })
    .isMongoId()
    .withMessage("Invalid reply message ID"),
];

export const editMessageValidator = [
  body("text")
    .trim()
    .notEmpty()
    .withMessage("Message text is required")
    .isLength({ max: 5000 })
    .withMessage("Message too long"),
];
