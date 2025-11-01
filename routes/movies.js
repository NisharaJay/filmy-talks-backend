const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");

// @route   GET /api/movies
// @desc    Get all movies
// @access  Public
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/movies/:id
// @desc    Get a single movie by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ msg: "Movie not found" });
    res.json(movie);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Movie not found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
