const path = require("path");
const Expense = require("../models/expense");
const sequelize = require("../utils/database");
const { error } = require("console");
exports.showForm = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../views", "index.html"));
};

exports.submitForm = async (req, res, next) => {
  const t = await sequelize.transaction();

  const data = req.body;

  try {
    let result = await req.user.update(
      { totalExpense: Number(req.user.totalExpense) + Number(data.amount) },
      { transaction: t }
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
        throw new Error("Failed to create Expense")
    }
    await t.commit();
    res.status(200).json(upExp);
  } catch (err) {
    await t.rollback();
    console.error('Transaction error:', err);

    res.status(500).json({
      success: false,
      error: err.message || 'Internal Server Error',
    });
  }
};

exports.getAll = (req, res, next) => {
  console.log("req user ", req.user.isPremiumUser);
  req.user
    .getExpenses()
    .then((data) => {
      res.json({ data, isPremiumUser: req.user.isPremiumUser });
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.removeExpenseById = async (req, res, next) => {
  console.log("Expense to delete ", req.params, "body : ", req.body);
  
  const t = await sequelize.transaction();


  try{

      let expenseData = await Expense.findByPk(req.params.id)
      if(!expenseData){
        throw new Error("Expense with given Id not found")
      }
      let expenseAmountRemain = Number(req.user.totalExpense) - Number(expenseData.amount)
      await expenseData.destroy({ transaction: t })
      let updatedUser = await req.user.update({
        totalExpense:expenseAmountRemain
      },{ transaction: t })
      console.log("updateuser" ,updatedUser)
      if(!updatedUser){
        throw new Error("User not updated")
      }

      await t.commit()
      res.status(200).json({
        success:true
      })

      
    }
    catch(err){
        await t.rollback()
        console.log("err in removeExpenseById",err.message,err)
        res.status(500).json({
            success:false,
            error:err.message || "Internal Server Error"
        })
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
