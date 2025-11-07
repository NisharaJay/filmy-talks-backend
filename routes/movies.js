const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Movie = require("../models/Movie");
const mongoose = require("mongoose");

// @route   GET /api/movies
// @desc    Get all movies WITH populated reviews
// @access  Public
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().populate(
      "reviews.user", 
      "fullName email"
    );

    const transformedMovies = movies.map(movie => ({
      ...movie.toObject(),
      reviews: movie.reviews.map(review => ({
        _id: review._id,
        comment: review.comment,
        rating: review.rating,
        createdAt: review.createdAt,
        _userId: review.user?._id,
        fullName: review.user?.fullName,
        email: review.user?.email,        
      }))
    }));

    res.json(transformedMovies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/movies/:id
// @desc    Get a single movie by ID with populated reviews
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate(
      "reviews.user",
      "fullName email"
    );

    if (!movie) return res.status(404).json({ msg: "Movie not found" });

    const transformedMovie = {
      ...movie.toObject(),
      reviews: movie.reviews.map(review => ({
        _id: review._id,
        comment: review.comment,
        rating: review.rating,
        createdAt: review.createdAt,
        _userId: review.user?._id,
        fullName: review.user?.fullName,
        email: review.user?.email,
      }))
    };

    res.json(transformedMovie);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// @route   POST /api/movies/:id/reviews
// @desc    Add a review to a movie (logged-in users only)
router.post("/:id/reviews", auth, async (req, res) => {
  const { comment, rating } = req.body;

  console.log("=== Incoming Request ===");
  console.log("Params:", req.params);
  console.log("Body:", req.body);
  console.log("User ID:", req.user.id);

  // Validate input
  if (!comment || rating === undefined) {
    return res.status(400).json({ msg: "Comment and rating are required" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ msg: "Rating must be between 1 and 5" });
  }

  // Validate movie ID format
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ msg: "Invalid movie ID format" });
  }

  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      console.log("Movie not found in DB for ID:", req.params.id);
      return res.status(404).json({ msg: "Movie not found" });
    }

    // Check if user already reviewed
    const alreadyReviewed = movie.reviews.find(
      (r) => r.user.toString() === req.user.id
    );
    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ msg: "You have already reviewed this movie" });
    }

    const newReview = {
      user: req.user.id,
      comment,
      rating,
    };

    movie.reviews.push(newReview);

    // Update overall movie rating
    const totalRatings = movie.reviews.reduce((acc, r) => acc + r.rating, 0);
    movie.rating = totalRatings / movie.reviews.length;

    await movie.save();

    // Populate user info for frontend
    const populatedMovie = await Movie.findById(req.params.id).populate(
      "reviews.user",
      "fullName email"
    );

    console.log("Review added successfully!");
    res.json(
      populatedMovie.reviews.map((r) => ({
        _id: r._id,
        comment: r.comment,
        rating: r.rating,
        createdAt: r.createdAt,
        user: {
          _id: r.user._id,
          name: r.user.fullName,
          email: r.user.email,
        },
      }))
    );
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;