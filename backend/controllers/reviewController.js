import Book from "../models/Book.js";
import Review from "../models/Review.js";

const refreshAverageRating = async (bookId) => {
  const stats = await Review.aggregate([
    { $match: { book: bookId } },
    { $group: { _id: "$book", average: { $avg: "$rating" } } }
  ]);
  await Book.findByIdAndUpdate(bookId, { rating: stats[0] ? Number(stats[0].average.toFixed(1)) : 0 });
};

export const getReviewsByBook = async (req, res, next) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId }).populate("user", "name").sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const review = await Review.create({ ...req.body, user: req.user._id });
    await refreshAverageRating(review.book);
    res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      return next(new Error("You already reviewed this book"));
    }
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, user: req.user._id });
    if (!review) {
      res.status(404);
      throw new Error("Review not found");
    }
    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;
    await review.save();
    await refreshAverageRating(review.book);
    res.json(review);
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const query = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, user: req.user._id };
    const review = await Review.findOne(query);
    if (!review) {
      res.status(404);
      throw new Error("Review not found");
    }
    const bookId = review.book;
    await review.deleteOne();
    await refreshAverageRating(bookId);
    res.json({ message: "Review deleted" });
  } catch (error) {
    next(error);
  }
};
