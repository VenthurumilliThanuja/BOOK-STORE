import express from "express";
import { body } from "express-validator";
import {
  createReview,
  deleteReview,
  getReviewsByBook,
  updateReview
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.get("/:bookId", getReviewsByBook);
router.post(
  "/",
  protect,
  [body("book").notEmpty(), body("rating").isInt({ min: 1, max: 5 }), body("comment").notEmpty()],
  validate,
  createReview
);
router.put("/:id", protect, [body("rating").optional().isInt({ min: 1, max: 5 })], validate, updateReview);
router.delete("/:id", protect, deleteReview);

export default router;
