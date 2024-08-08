const User = require('../models/Users')
const path = require('path')
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');

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

            //comparing password with has in db
            bcrypt.compare(login.password,user.password).then(result=>{
                console.log("rsult ",result,"user.id: ",user.id)
                if(result==false){
                    res.status(401).json({
                        success:false,
                        message:"User Not Authorized"
                    })
                }else{

                    //create jwt token now
                    console.log("secret key ",process.env.tokenSecret)
                    var token = jwt.sign({ id: user.id }, process.env.tokenSecret);
                    res.status(200).json({
                        success:true,
                        message:"User is succesfuly logged in",
                        token:token
                    })

                }
            })


        }
    })
}


exports.showSignup = (req,res)=>{
    res.sendFile(path.join(__dirname,'../views','signup','signup.html'))
}

exports.createUser=(req,res)=>{
    console.log(req.body)
    //encrypting our password
    let plainPsd = req.body.password
    let salt = 10
    bcrypt.hash(plainPsd,salt).then(hash=>{
        console.log("hash ",hash)
        User.create({name:req.body.name,email:req.body.email,password:hash})
        .then(user=>{
            res.json(user)
        }).catch(error=>{
            let errormsg = error?.errors?.[0]?.message ?? error.message    
            res.json({
                error:errormsg
            })
        })
    })
}