import { body } from "express-validator";

export const updateProfileValidator = [
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be 3-30 characters"),
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Bio must be under 150 characters"),
  body("avatar").optional().isString(),
];
