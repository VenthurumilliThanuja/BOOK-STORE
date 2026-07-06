import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Book from "../models/Book.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";
import User from "../models/User.js";
import LoginLog from "../models/LoginLog.js";
import LogoutLog from "../models/LogoutLog.js";

dotenv.config();
await connectDB();

const users = [
  { name: "Admin User", email: "admin@bookstore.com", password: "admin123", role: "admin" },
  { name: "Demo Reader", email: "user@bookstore.com", password: "user123", role: "user" }
];

const books = [
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    genre: "Technology",
    price: 799,
    rating: 4.8,
    description: "A practical guide to writing adaptable, professional software with clarity and care.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=80",
    stock: 20,
    popularity: 18
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self Help",
    price: 499,
    rating: 4.7,
    description: "A system for building better habits through small repeatable improvements.",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=700&q=80",
    stock: 30,
    popularity: 25
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Fiction",
    price: 299,
    rating: 4.5,
    description: "A modern classic about dreams, destiny, and the courage to follow a personal legend.",
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=700&q=80",
    stock: 40,
    popularity: 30
  },
  {
    title: "Zero to One",
    author: "Peter Thiel",
    genre: "Business",
    price: 599,
    rating: 4.4,
    description: "A startup book about creating new value, building monopolies, and thinking independently.",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=700&q=80",
    stock: 18,
    popularity: 16
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "Technology",
    price: 899,
    rating: 4.6,
    description: "Principles and practices for writing readable, maintainable, and disciplined software.",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=700&q=80",
    stock: 15,
    popularity: 21
  },
  {
    title: "Ikigai",
    author: "Hector Garcia",
    genre: "Self Help",
    price: 349,
    rating: 4.3,
    description: "A reflective guide to finding purpose, balance, and everyday joy.",
    image: "https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=700&q=80",
    stock: 26,
    popularity: 20
  }
];

try {
  await Promise.all([
    User.deleteMany(),
    Book.deleteMany(),
    Order.deleteMany(),
    Review.deleteMany(),
    LoginLog.deleteMany(),
    LogoutLog.deleteMany()
  ]);
  const createdUsers = await Promise.all(users.map((user) => User.create(user)));
  const createdBooks = await Book.insertMany(books);
  await Review.create({
    user: createdUsers[1]._id,
    book: createdBooks[0]._id,
    rating: 5,
    comment: "Excellent for learning professional development habits."
  });
  console.log("Sample data inserted");
  console.log("Admin: admin@bookstore.com / admin123");
  console.log("User: user@bookstore.com / user123");
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}

