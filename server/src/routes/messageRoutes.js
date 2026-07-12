import { Router } from "express";
import * as messageController from "../controllers/messageController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validateMiddleware from "../middleware/validateMiddleware.js";
import {
  editMessageValidator,
  sendMessageValidator,
} from "../validators/messageValidator.js";

const router = Router();

router.use(authMiddleware);

router.post("/", sendMessageValidator, validateMiddleware, messageController.sendMessage);
router.get("/conversations", messageController.getRecentConversations);
router.get("/search", messageController.searchMessages);
router.get("/:userId", messageController.getConversation);
router.put("/:id", editMessageValidator, validateMiddleware, messageController.editMessage);
router.delete("/:id", messageController.deleteMessage);
router.patch("/:id/seen", messageController.markSeen);

export default router;
