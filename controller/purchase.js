const Razorpay = require('razorpay');
const Order = require('../models/orders');
const User = require('../models/Users');

exports.purchasePremium = (req,res,next)=>{
    try{
        var instance = new Razorpay({
            key_id: process.env.Key_id,
            key_secret: process.env.Key_Secret,
        });

        const amount=10000       
        
        instance.orders.create({amount,currency:"INR"},(err,result)=>{
            if(err){
                throw new Error(JSON.stringify(err))
            }            
            console.log("reessult: ",result)
            req.user.createOrder({orderId:result.id,status:"PENDING"})
            .then(()=>{
                return res.status(201).json({
                    result,
                    key_id:instance.key_id
                })
            }).catch(err=>{
                throw new Error(err)
            })
        })
        
    }catch(error){
        console.log("32 error ",error)
        res.status(403).json({
            message:'Something went wrong',
            error:error
        })
    }
    
    
}

exports.updateTransaction = (req,res,next)=>{

    try{
        const {payment_id,order_id} = req.body


        console.log("user id ",req.user.id,payment_id,order_id)
        Promise.all([updatePaymentStatus(order_id,payment_id),updateUserPremiumStatus(req.user.id)])
        .then(result=>{

            console.log("Res ",result)
            
            return res.status(202).json({
                success:true,
                message:"Transaction successfully"
            })

        }).catch(err=>{
            throw new Error(err)
        })

        // Order.findOne({where:{orderId:order_id}})
        // .then((order)=>{
        //     return order.update({paymentId:payment_id,status:true})        
        // }).then(()=>{
        //     return req.user.update({isPremiumUser:true})
        // }).then(()=>{
        // }).catch(err=>{
        // })
    }catch(err){
        console.log(err)
        res.status(401).json({
            success:false,
            message:"Transaction failed"
        })
    }




}

function updatePaymentStatus(orderId,payment_id){

    return Order.update({paymentId:payment_id,status:true},{
        where:{orderId:orderId}
    })

}

function updateUserPremiumStatus(id){
    return User.update({isPremiumUser:true},{where:{id:id}})
}