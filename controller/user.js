const User = require('../models/Users')
const path = require('path')

exports.showLogin = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../views','signup','signin.html'))
}

exports.submitLogin = (req,res,next)=>{

    let login = req.body
    console.log("login info ",login)
    User.findAll({where:{email:login.email}}).then(user=>{
        if(user.length==0){
            res.status(404).json({
                success:false,
                message:"User not found"
            })
        }else{
            user = user[0]
            console.log("user from db ",user.password)
            if(user.password!=login.password){
                res.status(401).json({
                    success:false,
                    message:"User Not Authorized"
                })
            }else{
                res.status(200).json({
                    success:true,
                    message:"User is succesfuly logged in"
                })
            }
        }
    })
}


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