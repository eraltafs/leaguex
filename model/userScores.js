const mongoose = require("mongoose");

const userScoreSchema = new mongoose.Schema(
  {
    room: Number,
    players: {},
    player1Score: Number,
    player2Score: Number,
    winner: String,
  },
  { timestamps: true, versionKey: false }
);

const UserScore = mongoose.model("UserScore", userScoreSchema);

module.exports = {
  UserScore,
};
