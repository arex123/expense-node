const sequelize = require("sequelize");
const Expense = require("../models/expense");
const User = require("../models/Users");

exports.showLeaderboard = (req, res, next) => {
  // User.findAll({
  //   attributes: [
  //     "id",
  //     "name",
  //    [ sequelize.fn("SUM", sequelize.col("expenses.amount")),
  //     "totalAmount"],
  //   ],
  //   include: [
  //     {
  //       model: Expense,
  //       attributes: [],
  //     },
  //   ],
  //   group:['user.id'],
  //   order:[['totalAmount','DESC']]
  // })
  User.findAll({
    attributes: [
      "id",
      "name",
     "totalExpense"
    ],
    group:['user.id'],
    order:[['totalExpense','DESC']]
  })
    .then((result) => {
      let resultObj = [];

      //traversing result/users
    //   for (let userIdx in result) {
    //     let sum = 0;
    //     for (
    //       let expenseIdx = 0;
    //       expenseIdx < result[userIdx].expenses.length;
    //       expenseIdx++
    //     ) {
    //       console.log(
    //         "result[i].expenses.amount 11 ",
    //         result[userIdx].expenses[expenseIdx].amount
    //       );
    //       sum += Number(result[userIdx].expenses[expenseIdx].amount);
    //     }
    //     resultObj.push({ name: result[userIdx].name, totalSum: sum });
    //   }
    //   resultObj.sort((a, b) => b.totalSum - a.totalSum);
    console.log("rrr : ",result)
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};
