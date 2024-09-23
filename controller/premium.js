const sequelize = require("sequelize");
const Expense = require("../models/expense");
const User = require("../models/Users");

exports.showLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await User.find({}, 'name totalExpense') 
      .sort({ totalExpense: -1 }) 
      .exec(); 

    
    res.json(leaderboard);
  } catch (err) {
    console.error("Error retrieving leaderboard:", err);
    res.status(500).json({
      message: "Error retrieving leaderboard",
      error: err,
    });
  }
};
