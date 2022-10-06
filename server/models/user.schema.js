const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  playerStats: {
    maxHealth: Number,
    currHealth: Number,
    damage: Number,
    gold: Number,
    currLevel: Number,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
