import express from "express";
import { body } from "express-validator";
import {
  createBook,
  deleteBook,
  getBookById,
  getBookMeta,
  getBooks,
  updateBook
} from "../controllers/bookController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";

const router = express.Router();
const bookValidation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("author").notEmpty().withMessage("Author is required"),
  body("genre").notEmpty().withMessage("Genre is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be valid"),
  body("description").notEmpty().withMessage("Description is required"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be valid")
];

router.get("/", getBooks);
router.get("/meta", getBookMeta);
router.get("/:id", getBookById);
router.post("/", protect, authorize("admin"), upload.single("image"), bookValidation, validate, createBook);
router.put("/:id", protect, authorize("admin"), upload.single("image"), updateBook);
router.delete("/:id", protect, authorize("admin"), deleteBook);

export default router;
