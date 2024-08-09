const express = require('express')
const bodyParser = require('body-parser');
const path = require('path');

const userRouter = require('./routes/user')
const expenseRouter = require('./routes/expense')
const purchaseRouter = require('./routes/purchase')
const premiumRoutes = require('./routes/premium')

const User = require('./models/Users')
const Expense = require('./models/expense')

const app = express()
const sequelize = require('./utils/database');
const Order = require('./models/orders');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
require('dotenv').config()



app.use(express.static(path.join(__dirname, 'views'))); //for serving html,css files openly



app.use('/user',userRouter)
app.use('/expense',expenseRouter)
app.use('/purchase',purchaseRouter)
app.use('/premium',premiumRoutes)

//create relation
User.hasMany(Expense)
Expense.belongsTo(User)



//creating relationship between user and its order
User.hasMany(Order)
Order.belongsTo(User)

sequelize
.sync()
// .sync({force:true})
.then(d=>{

    app.listen(3002,()=>{
        console.log("server running at 3002 port")
    })
}).catch(e=>{
    console.log(e)
})