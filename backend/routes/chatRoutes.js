import express from "express";
import { body } from "express-validator";
import { chatWithAssistant } from "../controllers/chatController.js";
import { validate } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post(
  "/",
  [body("message").trim().notEmpty().withMessage("Message is required")],
  validate,
  chatWithAssistant
);

export default router;
