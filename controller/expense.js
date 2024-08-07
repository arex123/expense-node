const path = require('path');
const Expense = require('../models/expense')

exports.showForm = (req,res,next)=>{
    res.sendFile(path.join(__dirname, '../views', 'index.html'));
}

exports.submitForm = (req,res,next)=>{
    const data = req.body
    console.log("submitting form data: ",data)
    // Expense.create({
    req.user.createExpense({
        amount:data.amount,
        description:data.description,
        category:data.category
    }).then((data)=>{
        res.json(data)
    }).catch(e=>{
        console.log("error while creating ",e)
    })   
}

exports.getAll = (req,res,next)=>{
    req.user.getExpenses()
    .then(data=>{
        res.json(data)
    }).catch(e=>{
        console.log(e)
    })
}

exports.removeExpenseById = (req,res,next)=>{
    console.log("Expense to delete ",req.params,"body : ",req.body)
    Expense.findByPk(req.params.id).then(expense=>{
        return expense.destroy()
    }).then((d)=>{
        res.json(d)
    }).catch(e=>{
        console.log(e)
    })
}