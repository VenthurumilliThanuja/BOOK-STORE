import Book from "../models/Book.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const [users, books, orders, reviews, revenue] = await Promise.all([
      User.countDocuments(),
      Book.countDocuments(),
      Order.countDocuments(),
      Review.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }])
    ]);
    res.json({ users, books, orders, reviews, revenue: revenue[0]?.total || 0 });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    user.role = req.body.role || user.role;
    await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    await user.deleteOne();
    res.json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().populate("user", "name email").populate("book", "title").sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};
