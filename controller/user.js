const User = require('../models/Users')
const path = require('path')
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

exports.showLogin = (req,res,next)=>{
    res.sendFile(path.join(__dirname,'../views','signin.html'))
}


exports.submitLogin = (req, res, next) => {
    const login = req.body;
    console.log("login info ", login);
  
    // Using correct syntax for Mongoose query
    User.findOne({ email: login.email })
      .then(user => {
        if (!user) {
          // User not found
          return res.status(404).json({
            success: false,
            message: "User not found"
          });
        }
        
        // User found, now compare password
        console.log("user from db ", user.password);
        bcrypt.compare(login.password, user.password)
          .then(result => {
            if (!result) {
              // Password does not match
              return res.status(401).json({
                success: false,
                message: "User Not Authorized"
              });
            }
  
            // Password matches, create JWT token
            console.log("secret key ", process.env.tokenSecret);
            const token = jwt.sign({ id: user._id }, process.env.tokenSecret, { expiresIn: '1h' });
  
            res.status(200).json({
              success: true,
              message: "User is successfully logged in",
              token: token
            });
          })
          .catch(err => {
            // Error during bcrypt compare
            console.error("Error comparing passwords: ", err);
            res.status(500).json({
              success: false,
              message: "Error during login"
            });
          });
      })
      .catch(err => {
        // Error during finding user
        console.error("Error finding user: ", err);
        res.status(500).json({
          success: false,
          message: "Error during login"
        });
      });
};


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
const { default: mongoose } = require('mongoose');
//referece: https://app.brevo.com/settings/keys/api, https://developers.brevo.com/reference/sendtransacemail


exports.forgetPsd = async (req, res) => {
    try {
      console.log("Sending email for forget password: ", req.body, req.body.email);
  
      // Initialize SendInBlue API client
      var defaultClient = SibApiV3Sdk.ApiClient.instance;
      var apiKey = defaultClient.authentications['api-key'];
      apiKey.apiKey = process.env.email_api_key;
  
      let uniqueId = uuidv4();
      let email = req.body.email;
      
      // Check if user exists with the given email
      let user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
  
      // Create a forgot password request for the user
      // let forgetdata = await user.createForgotPasswordRequest({ id: uniqueId, isactive: true });
      let forgetdata = await ForgotPasswordRequests.create({ uniqueId : uniqueId, isactive: true });
      if (!forgetdata) {
        throw new Error("Could not create forgot password request");
      }
  
      // Prepare and send the transactional email
      let tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();
  
      const sender = {
        email: 'iwanttoearn01@gmail.com'
      };
      const receivers = [{
        email: req.body.email
      }];
  
      const resetLink = `${process.env.serverUrl}user/password/resetpasswordform/${uniqueId}`;
      
      await tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: "Reset Password Link",
        textContent: `Reset your password by clicking here: {{params.link}}`,
        params: {
          link: resetLink
        }
      });
  
      // Success response
      return res.status(200).json({
        success: true,
        message: "Password reset email sent successfully"
      });
  
    } catch (err) {
      console.error("Error in forgetPsd: ", err);
  
      // Error response
      return res.status(500).json({
        success: false,
        message: err.message || "An error occurred while processing the request"
      });
    }
  };
  

exports.resetpasswordform = (req,res)=>{
    console.log("1388")
    res.sendFile(path.join(__dirname,'../views','reset-psd.html'))

}

exports.resetpassword = async (req, res) => {
    let { password: npassword, id } = req.body;
    console.log("Reset password request for: ", npassword, id);
  
    try {
      // Fetch the ForgotPasswordRequest record to get userId
      let forgetData = await ForgotPasswordRequests.findOne({ uniqueId: id, isactive: true });
      if (!forgetData) {
        return res.status(404).json({
          success: false,
          message: "Password reset request not found or already used"
        });
      }
  
      // Update isactive to false
      await ForgotPasswordRequests.updateOne(
        { uniqueId: id },
        { isactive: false }
      );
  
      // Hash the new password
      const saltRounds = 11;
      let hashedPassword = await bcrypt.hash(npassword, saltRounds);
  
      // Update user's password
      let userData = await User.updateOne(
        { _id: forgetData.userId }, // Use `_id` for MongoDB
        { password: hashedPassword }
      );
  
      // Check if any document was updated
      if (userData.nModified === 0) {
        return res.status(400).json({
          success: false,
          message: "User password could not be updated"
        });
      }
  
      // Respond with success
      return res.status(200).json({
        success: true,
        message: "Password updated successfully"
      });
  
    } catch (err) {
      console.error("Error while resetting password: ", err);
      res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
      });
    }
  };