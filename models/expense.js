const mongoose = require("mongoose");

const Expense = mongoose.model(
  "expense",
  new mongoose.Schema({
    amount: String,
    description: {
      type: String,
    },
    category: {
      type: String,
    },
  })
);

module.exports = Expense;
