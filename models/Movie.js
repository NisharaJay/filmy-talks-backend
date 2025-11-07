const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  movieName: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  status: { type: String, required: true },
  category: { type: String, required: true },
  Director: { type: String },
  description: { type: String },
  cast: [{ type: String }],
  bannerImage: { type: String },
  rating: { type: Number, default: 0 },
  reviews: [
    {
      user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      comment: { type: String, required: true },
      rating: { type: Number, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Movie", movieSchema);