import { Router } from "express";
// import * as userController from "../controllers/userController.js";
import userController from "../controllers/userController.js";
import  authMiddleware  from "../middleware/authMiddleware.js";
import  validateMiddleware  from "../middleware/validateMiddleware.js";
import { updateProfileValidator } from "../validators/userValidator.js";

const router = Router();

router.use(authMiddleware);

router.get("/profile", userController.getProfile);
router.put("/profile", updateProfileValidator, validateMiddleware, userController.updateProfile);
router.get("/search", userController.searchUsers);
router.get("/:id", userController.getUserById);

export default router;
