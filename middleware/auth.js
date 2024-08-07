var jwt = require('jsonwebtoken');
const User = require('../models/Users');

exports.authenticate = (req,res,next)=>{

    try{
        const token = req.header('Authorization')
        console.log("8 token ",token)
        const user = jwt.verify(token,"SecretAdiKumar")
        console.log("user ",user)

        User.findByPk(user.id).then(user=>{
            req.user = user
            next()
        }).catch(err=>{
            console.log("16 err ",error)
            throw new Error(err)
        })

    }catch(error){

        console.log("21 error ",error)
        return res.status(401).json({
            success:false
        })
    }
}