const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  movieName: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  status: { type: String, required: true }, // Now Showing, Past, Upcoming
  category: { type: String, required: true },
  Director: { type: String },
  description: { type: String },
  cast: [{ type: String }], // Array of cast names
  bannerImage: { type: String },
  rating: { type: Number, default: 0 },
  reviews: [
    {
      user: { type: String },
      comment: { type: String },
      rating: { type: Number }
    }
  ]
});

module.exports = mongoose.model("Movie", movieSchema);
