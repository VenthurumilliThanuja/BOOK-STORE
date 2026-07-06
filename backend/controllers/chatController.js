import Book from "../models/Book.js";

const normalize = (value = "") => value.toLowerCase().trim();

const buildBookReply = (books, fallback) => {
  if (!books.length) {
    return fallback;
  }

  const list = books
    .slice(0, 4)
    .map((book) => `${book.title} by ${book.author} - Rs. ${book.price} (${book.genre}, rating ${book.rating || 0})`)
    .join("\n");

  return `Here are some books you may like:\n${list}`;
};

export const chatWithAssistant = async (req, res, next) => {
  try {
    const message = normalize(req.body.message);

    if (!message) {
      res.status(400);
      throw new Error("Message is required");
    }

    let reply = "";

    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      reply = "Hello! I am your BookStore assistant. I can help you find books, explain checkout, or guide you with login, cart, orders, and admin features.";
    } else if (message.includes("login") || message.includes("register") || message.includes("account")) {
      reply = "To create an account, open Register and enter your name, email, and password. To login, use your registered email and password. Admin login can access the Admin Dashboard.";
    } else if (message.includes("cart")) {
      reply = "To use the cart, open any book and click Add to Cart. You can increase quantity, remove books, clear the cart, and proceed to checkout.";
    } else if (message.includes("checkout") || message.includes("payment") || message.includes("order")) {
      reply = "Checkout asks for shipping details and uses a dummy payment success flow for this college project. After placing an order, you can view it in My Orders.";
    } else if (message.includes("admin")) {
      reply = "Admin users can open the Admin Dashboard to manage books, users, orders, and reviews. Login with an admin account first.";
    } else if (message.includes("cheap") || message.includes("low price") || message.includes("budget")) {
      const books = await Book.find().sort({ price: 1 }).limit(4);
      reply = buildBookReply(books, "I could not find budget books right now.");
    } else if (message.includes("best") || message.includes("popular") || message.includes("recommend")) {
      const books = await Book.find().sort({ rating: -1, popularity: -1 }).limit(4);
      reply = buildBookReply(books, "I could not find recommendations right now.");
    } else {
      const words = message.split(/\s+/).filter((word) => word.length > 2);
      const search = words.join(" ");
      const books = search
        ? await Book.find(
            { $text: { $search: search } },
            { score: { $meta: "textScore" } }
          )
            .sort({ score: { $meta: "textScore" } })
            .limit(4)
        : [];

      reply = buildBookReply(
        books,
        "I can help with book recommendations, cart, checkout, orders, login, registration, and admin features. Try asking: recommend technology books."
      );
    }

    res.json({ reply });
  } catch (error) {
    next(error);
  }
};
