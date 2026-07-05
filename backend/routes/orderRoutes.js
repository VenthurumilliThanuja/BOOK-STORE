import express from "express";
import { body } from "express-validator";
import {
  cancelOrder,
  getAllOrders,
  getMyOrders,
  placeOrder,
  updateOrderStatus
} from "../controllers/orderController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  [
    body("books").isArray({ min: 1 }).withMessage("Books are required"),
    body("shippingAddress.fullName").notEmpty().withMessage("Full name required"),
    body("shippingAddress.address").notEmpty().withMessage("Address required"),
    body("shippingAddress.city").notEmpty().withMessage("City required")
  ],
  validate,
  placeOrder
);
router.get("/", protect, getMyOrders);
router.get("/all", protect, authorize("admin"), getAllOrders);
router.put("/:id/cancel", protect, cancelOrder);
router.put("/:id", protect, authorize("admin"), updateOrderStatus);

export default router;
