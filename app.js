const express = require('express')
const bodyParser = require('body-parser');
const path = require('path');

const userRouter = require('./routes/user')
const expenseRouter = require('./routes/expense')

const app = express()
const sequelize = require('./utils/database')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));



app.use(express.static(path.join(__dirname, 'views'))); //for serving css files


app.use('/user',userRouter)
app.use('/expense',expenseRouter)



sequelize.sync().then(d=>{

    app.listen(3002,()=>{
        console.log("server running at 3002 port")
    })
}).catch(e=>{
    console.log(e)
})