const User = require("../models/User");

exports.addToFavorites = async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.favorites.includes(movieId)) {
      return res.status(400).json({ message: "Already in favorites" });
    }

    user.favorites.push(movieId);
    await user.save();

    const updatedUser = await User.findById(req.user.id)
      .select("-password")
      .populate("favorites");

    res.json({
      message: "Added to favorites",
      favorites: updatedUser.favorites
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeFromFavorites = async (req, res) => {
  try {
    const { movieId } = req.params;
    const user = await User.findById(req.user.id);

    user.favorites = user.favorites.filter(id => id.toString() !== movieId);
    await user.save();

    const updatedUser = await User.findById(req.user.id)
      .select("-password")
      .populate("favorites");

    res.json({
      message: "Removed from favorites",
      favorites: updatedUser.favorites
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("favorites");

    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};