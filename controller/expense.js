const path = require("path");
const Expense = require("../models/expense");
// const sequelize = require("../utils/database");
const { error } = require("console");
const { uploadToS3 } = require("../services/s3Services");
const FilesUploaded = require("../models/FileUploaded");
const mongoose = require('mongoose')

exports.download = async (req, res, next) => {
  try {
    let expenses = await req.user.getExpenses();
    let stringifyExpense = JSON.stringify(expenses);

    const userId = req.user.id;
    const fileName = `Expense${userId}/${new Date()}.txt`;
    const fileUrl = await uploadToS3(fileName, stringifyExpense);
    if(fileUrl){
      console.log("req.user ",req.user)
      await req.user.createFilesUploaded({url:fileUrl})
    }
    res.status(200).json({
      success: true,
      fileUrl,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      err,
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
  const t = await mongoose.startSession();
  t.startTransaction()

  const data = req.body;

  try {
    let result = await User.updateOne(
      { totalExpense: Number(req.user.totalExpense) + Number(data.amount) },
      { session: t }
    );
    if (!result) {
      throw new Error("Failed to update user's total expense");
    }
    let upExp = await req.user.createExpense(
      {
        amount: data.amount,
        description: data.description,
        category: data.category,
      },
      { transaction: t }
    );
    if (!upExp) {
      throw new Error("Failed to create Expense");
    }
    await t.commit();
    res.status(200).json(upExp);
  } catch (err) {
    await t.rollback();
    console.error("Transaction error:", err);

    res.status(500).json({
      success: false,
      error: err.message || "Internal Server Error",
    });
  }
};

exports.products = async (req, res, next) => {
  console.log("req user ", req.user.isPremiumUser);

  let page = parseInt(req.query.page) || 1; 
  let limit =  parseInt(req.query.pageItems) || 3;  
  let offset = (page - 1) * limit; 

  console.log("page: ",page," Limit: ",limit)

  try {
    const expenseCount = await req.user.countExpenses();  // Get the total count of expenses

    const expenses = await req.user.getExpenses({
      offset,
      limit
    });

    res.json({
      products: expenses,
      pageData:{
        currentPage: page,
        hasNextPage:limit*page<expenseCount,
        nextPage:page+1,
        hasPrevPage:page>1,
        prevPage:page-1,
        expenseCount,        
        lastPage: Math.ceil(expenseCount / limit)
      },
      isPremiumUser: req.user.isPremiumUser,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: 'Failed to retrieve expenses' });
  }
};


exports.removeExpenseById = async (req, res, next) => {
  console.log("Expense to delete ", req.params, "body : ", req.body);

  // const t = await sequelize.transaction();

  try {
    let expenseData = await Expense.findByPk(req.params.id);
    if (!expenseData) {
      throw new Error("Expense with given Id not found");
    }
    let expenseAmountRemain =
      Number(req.user.totalExpense) - Number(expenseData.amount);
    await expenseData.destroy({ transaction: t });
    let updatedUser = await req.user.update(
      {
        totalExpense: expenseAmountRemain,
      },
      { transaction: t }
    );
    console.log("updateuser", updatedUser);
    if (!updatedUser) {
      throw new Error("User not updated");
    }

    await t.commit();
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    await t.rollback();
    console.log("err in removeExpenseById", err.message, err);
    res.status(500).json({
      success: false,
      error: err.message || "Internal Server Error",
    });
  }

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
};
