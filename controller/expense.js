const path = require("path");
const Expense = require("../models/expense");

exports.showForm = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../views", "index.html"));
};

exports.submitForm = (req, res, next) => {
  const data = req.body;
  console.log("submitting form data: ", data);
  // Expense.create({

  req.user
    .update({
      totalExpense: Number(req.user.totalExpense) + Number(data.amount),
    })
    .then((res) => {
      return req.user.createExpense({
        amount: data.amount,
        description: data.description,
        category: data.category,
      });
    })
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.log("error while creating ", e);
    });
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

exports.removeExpenseById = (req, res, next) => {
  console.log("Expense to delete ", req.params, "body : ", req.body);

  let myCExp 
  Expense.findByPk(req.params.id)
    .then((expense) => {
        myCExp = expense
      return req.user.update({
        totalExpense: Number(req.user.totalExpense) - Number(expense.amount),
      });      
    }).then((res)=>{
        return myCExp.destroy();
    })
    .then((d) => {
      res.json(d);
    })
    .catch((e) => {
      console.log(e);
    });
};
