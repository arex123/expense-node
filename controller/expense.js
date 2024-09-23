const path = require("path");
const Expense = require("../models/expense");
// const sequelize = require("../utils/database");
const { error } = require("console");
const { uploadToS3 } = require("../services/s3Services");
const FilesUploaded = require("../models/FileUploaded");
const mongoose = require('mongoose')
const User = require('../models/Users')

exports.download = async (req, res, next) => {
  try {
    // Query expenses for the authenticated user (assuming req.user._id is available)
    const expenses = await Expense.find({ userId: req.user._id }); 
    const stringifyExpense = JSON.stringify(expenses);

    // Generate filename and upload to S3
    const userId = req.user._id; // Mongoose uses _id instead of id
    const fileName = `Expense${userId}/${new Date().toISOString()}.txt`;
    const fileUrl = await uploadToS3(fileName, stringifyExpense);

    if (fileUrl) {
      console.log("req.user ", req.user);

      // Create a new file upload entry in the database
      const fileUploaded = new FilesUploaded({
        userId: req.user._id, // Link the file to the user
        url: fileUrl,
      });

      await fileUploaded.save(); // Save the file upload to the database

      // Optionally add the file reference to the user (if needed in User schema)
      req.user.filesUploaded.push(fileUploaded._id); // Assuming a reference array exists
      await req.user.save();
    }

    res.status(200).json({
      success: true,
      fileUrl,
    });
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({
      success: false,
      error: err.message || err,
    });
  }
};

exports.leaderboard = (req,res,next)=>{
  res.sendFile(path.join(__dirname, "../views", "leaderBoard.html"));
}

exports.showForm = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../views", "index.html"));
};

exports.submitForm = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const data = req.body;

  try {
    // Update user's total expense
    let result = await User.updateOne(
      { _id: req.user._id }, // Use a filter to select the user by their ID
      { $inc: { totalExpense: Number(data.amount) } }, // Increment the totalExpense field
      { session } // Pass session for transaction
    );
    
    if (!result || result.nModified === 0) {
      throw new Error("Failed to update user's total expense");
    }

    // Create a new expense record
    let upExp = await Expense.create(
      [{
        userId: req.user._id, // Link the expense to the user
        amount: data.amount,
        description: data.description,
        category: data.category,
      }],
      { session } // Pass session for transaction
    );

    if (!upExp) {
      throw new Error("Failed to create Expense");
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json(upExp);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction error:", err);

    res.status(500).json({
      success: false,
      error: err.message || "Internal Server Error",
    });
  }
};
exports.products = async (req, res, next) => {
  console.log("req user isPremium: ", req.user.isPremiumUser);

  let page = parseInt(req.query.page) || 1; 
  let limit = parseInt(req.query.pageItems) || 3;  
  let offset = (page - 1) * limit;

  console.log("Page: ", page, " Limit: ", limit);

  try {
    // Get the total count of expenses for the user
    const expenseCount = await Expense.countDocuments({ userId: req.user._id });

    // Fetch expenses with pagination
    const expenses = await Expense.find({ userId: req.user._id })
      .skip(offset)
      .limit(limit);

      console.log("12expenses ",expenses)
    res.json({
      products: expenses,
      pageData: {
        currentPage: page,
        hasNextPage: limit * page < expenseCount,
        nextPage: page + 1,
        hasPrevPage: page > 1,
        prevPage: page - 1,
        expenseCount,
        lastPage: Math.ceil(expenseCount / limit)
      },
      isPremiumUser: req.user.isPremiumUser,
    });
  } catch (error) {
    console.error("Error retrieving expenses: ", error);
    res.status(500).json({ error: 'Failed to retrieve expenses' });
  }
};

exports.removeExpenseById = async (req, res, next) => {
  console.log("Expense to delete: ", req.params.id, " Body: ", req.body);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the expense by ID
    let expenseData = await Expense.findById(req.params.id).session(session);
    if (!expenseData) {
      throw new Error("Expense with given Id not found");
    }

    // Calculate the updated total expense
    let updatedTotalExpense = Number(req.user.totalExpense) - Number(expenseData.amount);

    // Delete the expense
    await Expense.deleteOne({ _id: req.params.id }).session(session);

    // Update the user's total expense
    let updatedUser = await User.updateOne(
      { _id: req.user._id },
      { totalExpense: updatedTotalExpense },
      { session }
    );

    if (updatedUser.nModified === 0) {
      throw new Error("User's total expense not updated");
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Expense removed and user updated successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error in removeExpenseById: ", err);
    res.status(500).json({
      success: false,
      error: err.message || "Internal Server Error",
    });
  }
};
  //   let myCExp;
  //   Expense.findByPk(req.params.id)
  //     .then((expense) => {
  //       myCExp = expense;
  //       return req.user.update({
  //         totalExpense: Number(req.user.totalExpense) - Number(expense.amount),
  //       });
  //     })
  //     .then((res) => {
  //       return myCExp.destroy();
  //     })
  //     .then((d) => {
  //       res.json(d);
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //     });
// };
