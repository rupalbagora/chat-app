import { Router } from "express";

import authController from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/authValidator.js";

const router = Router();

router.post("/register", registerValidator, validate, authController.register);

router.post("/login", loginValidator, validate, authController.login);

router.get("/profile", authMiddleware, authController.getMe);

export default router;
