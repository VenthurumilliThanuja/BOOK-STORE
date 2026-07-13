import express from "express";
import { body } from "express-validator";
import {
  changePassword,
  forgotPassword,
  getProfile,
  login,
  logout,
  register,
  updateProfile
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email")
      .isEmail()
      .withMessage("Valid email required")
      .customSanitizer((value) => String(value).trim().toLowerCase()),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  ],
  validate,
  register
);
router.post(
  "/login",
  [
    body("email").isEmail().customSanitizer((value) => String(value).trim().toLowerCase()),
    body("password").notEmpty()
  ],
  validate,
  login
);
router.post("/logout", protect, logout);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, [body("email").optional().isEmail()], validate, updateProfile);
router.post("/forgot-password", [body("email").isEmail()], validate, forgotPassword);
router.put(
  "/change-password",
  protect,
  [body("currentPassword").notEmpty(), body("newPassword").isLength({ min: 6 })],
  validate,
  changePassword
);

export default router;
