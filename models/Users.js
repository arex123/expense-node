const { default: mongoose, Schema } = require("mongoose");

const User = mongoose.model(
  "user",
  new Schema({
    name: String,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      unique: true,
      required: true,
    },
    isPremiumUser: { type: Boolean, default: 0 },
    totalExpense: {
      type: Number,
      default: 0,
    },
  })
);

module.exports = User;
