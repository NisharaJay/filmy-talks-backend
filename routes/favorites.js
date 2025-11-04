const express = require("express");
const {
  addToFavorites,
  removeFromFavorites,
  getFavorites
} = require("../controllers/favoriteController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth, addToFavorites);
router.delete("/:movieId", auth, removeFromFavorites);
router.get("/", auth, getFavorites);

module.exports = router;