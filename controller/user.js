const User = require('../models/Users')
const path = require('path')
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

exports.showLogin = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../views','signin.html'))
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
    res.sendFile(path.join(__dirname,'../views','signup.html'))
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
    
    

    // let forgetdata = await ForgotPasswordRequests.create({id:uniqueId,isactive:true})
    let forgetdata = await user.createForgotPasswordRequest({id:uniqueId,isactive:true})
    // let forgetdata = await ForgotPasswordRequests.create({id:uniqueId,userID:user.id,isactive:true})
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
        res.json({
            success:true,
        })
    }).catch(e=>{
        res.json({
            success:false,
        })
        console.log(e)
    })
}catch(err){
        res.json({
            success:false,
        })
        console.log("err ",err)
    }
}

exports.resetpasswordform = (req,res)=>{
    console.log("1388")
    res.sendFile(path.join(__dirname,'../views','reset-psd.html'))

}

exports.resetpassword = async (req, res) => {
    let npassword = req.body.password;
    let id = req.body.id;
    console.log("1389", npassword, id);

    try {
        // Fetch the ForgotPasswordRequest record to get userId
        let forgetData = await ForgotPasswordRequests.findOne({ where: { id: id, isactive: true } });
        if (!forgetData) {
            throw new Error("Password reset request not found or already used");
        }

        // Update isactive to false
        await ForgotPasswordRequests.update(
            { isactive: false },
            { where: { id: id } }
        );

        // Hash the new password
        let salt = 11;
        let hash = await bcrypt.hash(npassword, salt);

        // Update user's password
        let userData = await User.update(
            { password: hash },
            { where: { id: forgetData.userId } }
        );
        if (userData[0] === 0) {
            throw new Error("User password not updated");
        }

        // Respond with success
        res.status(200).json({
            success: true,
            message: "Password updated"
        });

    } catch (err) {
        console.log("errr ", err);
        res.status(500).json({
            success: false,
            message: err.message || "Internal Server Error"
        });
    }
};
