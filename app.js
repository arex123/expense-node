const express = require('express')
const bodyParser = require('body-parser');
const path = require('path');

const formRouter = require('./routes/form')

const app = express()
const sequelize = require('./utils/database')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));



app.use(express.static(path.join(__dirname, 'views')));


app.use(formRouter)



sequelize.sync().then(d=>{

    app.listen(3002,()=>{
        console.log("server running at 3002 port")
    })
}).catch(e=>{
    console.log(e)
})