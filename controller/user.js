const User = require('../models/Users')
const path = require('path')
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

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

var SibApiV3Sdk = require('sib-api-v3-sdk');
const ForgotPasswordRequests = require('../models/ForgotPasswordRequests');
const { where } = require('sequelize');
//referece: https://app.brevo.com/settings/keys/api, https://developers.brevo.com/reference/sendtransacemail

exports.forgetPsd =async (req,res)=>{

    try{

    
    console.log("sending email for forget psd: ",req.body,req.body.email)
    var defaultClient = SibApiV3Sdk.ApiClient.instance;
    var apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.email_api_key

    let uniqueId= uuidv4()
    console.log("uni ",uniqueId)
    let email=req.body.email
    //check if user exist with given email 
    let user = await User.findOne({ where: { email: email } });
    if(!user){
        throw new Error("err")
    }
    
    

    let forgetdata = await ForgotPasswordRequests.create({id:uniqueId,userId:user.id,isactive:true})
    if(!forgetdata){
        throw new Error("err")

    }



    let tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi()

    const sender = {
        email:'iwanttoearn01@gmail.com'
    }
    const recievers = [{
        // email:'aditya.connect0@gmail.com'
        email:req.body.email
    }]


    tranEmailApi.sendTransacEmail({
        sender,
        to:recievers,
        subject:"Reset Password Link",
        textContent:`Reset your password click here: {{params.link}}`,
        params:{
            link:process.env.serverUrl+ "user/password/resetpasswordform/"+uniqueId
        }
    }).then((result)=>{
        console.log("r:",result)
    }).catch(e=>{
        console.log(e)
    })
    }catch(err){
        console.log("err ",err)
    }
}

exports.resetpasswordform = (req,res)=>{
    console.log("1388")
    res.sendFile(path.join(__dirname,'../views','signup','reset-psd.html'))

}


exports.resetpassword = async(req,res)=>{
    let npasswaord = req.body.password
    let id = req.body.id
    console.log("1389",npasswaord,id)

    try{

        let forgetData = await ForgotPasswordRequests.update({
            isactive:false
        },{where:{
            id:id,isactive:true
        }})
        if(!forgetData ){
        throw new Error("err")
            
        }

        let salt=11
        let hash =await bcrypt.hash(npasswaord,salt)
        if(!hash){
            throw new Error("err")

        }
        let userData = await User.update({password:hash},{where:{id:forgetData.userId}})
        if(!userData){
            throw new Error("err")

        }

        res.status(200).json({
            success:true,
            message:"Password updated"
        })




    }catch(err){
        console.log("errr ",err)
    }

}