import Book from "../models/Book.js";
import Order from "../models/Order.js";

export const placeOrder = async (req, res, next) => {
  try {
    const { books, shippingAddress } = req.body;
    if (!books || books.length === 0) {
      res.status(400);
      throw new Error("Order must contain at least one book");
    }

    const ids = books.map((item) => item.book);
    const dbBooks = await Book.find({ _id: { $in: ids } });
    const items = books.map((item) => {
      const dbBook = dbBooks.find((book) => book._id.toString() === item.book);
      if (!dbBook) throw new Error("One or more books are unavailable");
      if (dbBook.stock < item.quantity) throw new Error(`${dbBook.title} does not have enough stock`);
      return { book: dbBook._id, title: dbBook.title, quantity: item.quantity, price: dbBook.price };
    });

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await Order.create({
      user: req.user._id,
      books: items,
      totalAmount,
      paymentStatus: "Paid",
      shippingAddress
    });

    await Promise.all(
      items.map((item) => Book.findByIdAndUpdate(item.book, { $inc: { stock: -item.quantity } }))
    );

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("books.book").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    if (["Shipped", "Delivered"].includes(order.orderStatus)) {
      res.status(400);
      throw new Error("Cannot cancel shipped or delivered orders");
    }
    order.orderStatus = "Cancelled";
    await order.save();
    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("user", "name email").populate("books.book").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    order.orderStatus = req.body.orderStatus || order.orderStatus;
    order.paymentStatus = req.body.paymentStatus || order.paymentStatus;
    await order.save();
    res.json(order);
  } catch (error) {
    next(error);
  }
};
