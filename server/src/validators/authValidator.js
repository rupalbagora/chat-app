import { body } from "express-validator";

export const registerValidator = [
  body("username").trim().notEmpty().isLength({ min: 3 }),

  body("email").isEmail().normalizeEmail(),

  body("password").isLength({ min: 6 }),
];

export const loginValidator = [
  body("email").isEmail(),

  body("password").notEmpty(),
];
