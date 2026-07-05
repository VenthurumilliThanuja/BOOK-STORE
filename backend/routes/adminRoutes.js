import express from "express";
import { deleteUser, getAllReviews, getDashboardStats, getUsers, updateUserRole } from "../controllers/adminController.js";
import { getAllOrders, updateOrderStatus } from "../controllers/orderController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));
router.get("/stats", getDashboardStats);
router.get("/users", getUsers);
router.put("/users/:id", updateUserRole);
router.delete("/users/:id", deleteUser);
router.get("/orders", getAllOrders);
router.put("/orders/:id", updateOrderStatus);
router.get("/reviews", getAllReviews);

export default router;
