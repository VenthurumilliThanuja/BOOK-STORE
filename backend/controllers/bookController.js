import Book from "../models/Book.js";

const buildBookQuery = (query) => {
  const filter = {};
  if (query.search) filter.$text = { $search: query.search };
  if (query.genre) filter.genre = new RegExp(query.genre, "i");
  if (query.author) filter.author = new RegExp(query.author, "i");
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }
  if (query.rating) filter.rating = { $gte: Number(query.rating) };
  return filter;
};

const buildSort = (sort) => {
  if (sort === "price-low") return { price: 1 };
  if (sort === "price-high") return { price: -1 };
  if (sort === "newest") return { createdAt: -1 };
  if (sort === "popularity") return { popularity: -1 };
  return { createdAt: -1 };
};

export const getBooks = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const filter = buildBookQuery(req.query);
    const total = await Book.countDocuments(filter);
    const books = await Book.find(filter)
      .sort(buildSort(req.query.sort))
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ books, page, pages: Math.ceil(total / limit) || 1, total });
  } catch (error) {
    next(error);
  }
};

export const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404);
      throw new Error("Book not found");
    }
    book.popularity += 1;
    await book.save();
    res.json(book);
  } catch (error) {
    next(error);
  }
};

export const createBook = async (req, res, next) => {
  try {
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image || "";
    const book = await Book.create({ ...req.body, image });
    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
};

export const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404);
      throw new Error("Book not found");
    }
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image ?? book.image;
    Object.assign(book, { ...req.body, image });
    const updated = await book.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404);
      throw new Error("Book not found");
    }
    await book.deleteOne();
    res.json({ message: "Book deleted" });
  } catch (error) {
    next(error);
  }
};

export const getBookMeta = async (req, res, next) => {
  try {
    const genres = await Book.distinct("genre");
    const authors = await Book.distinct("author");
    res.json({ genres, authors });
  } catch (error) {
    next(error);
  }
};
