const User = require('../models/Users')
const path = require('path')
exports.showSignup = (req,res)=>{
    res.sendFile(path.join(__dirname,'../views','signup','signup.html'))
}

exports.createUser=(req,res)=>{
    console.log(req.body)

    User.create({name:req.body.name,email:req.body.email,password:req.body.password})
    .then(user=>{
        res.json(user)
    }).catch(error=>{
        let errormsg = error?.errors?.[0]?.message ?? error.message

        res.json({
            error:errormsg
        })
    })

}