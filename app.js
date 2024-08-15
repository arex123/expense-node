const express = require('express')
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors')
const helmet = require('helmet')
const app = express()
const morgan = require('morgan')
const fs = require('fs')

app.use(express.static(path.join(__dirname, 'views'))); //for serving html,css files openly
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
require('dotenv').config()

// app.use(helmet())
// app.use(helmet({
//     contentSecurityPolicy: false
// }));


const accessLogStream = fs.createWriteStream(
    path.join(__dirname,'access.log'),
    {flags:'a'}
)

app.use(morgan('combined',{stream:accessLogStream}))

const userRouter = require('./routes/user')
const expenseRouter = require('./routes/expense')
const purchaseRouter = require('./routes/purchase')
const premiumRoutes = require('./routes/premium')

const User = require('./models/Users')
const Expense = require('./models/expense')
const ForgotPasswordRequests = require('./models/ForgotPasswordRequests')

const sequelize = require('./utils/database');
const Order = require('./models/orders');
const FilesUploaded = require('./models/FileUploaded');





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

User.hasMany(ForgotPasswordRequests)
ForgotPasswordRequests.belongsTo(User)

User.hasMany(FilesUploaded)
FilesUploaded.belongsTo(User)

sequelize
.sync()
// .sync({force:true})
.then(d=>{

    app.listen(process.env.PORT,()=>{
        console.log("server running at 3002 port")
    })
}).catch(e=>{
    console.log(e)
})