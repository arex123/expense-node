const Razorpay = require('razorpay');

exports.purchasePremium = (req,res,next)=>{

    try{

        var instance = new Razorpay({
            key_id: process.env.Key_id,
            key_secret: process.env.Key_Secret,
        });
        
        const amount=10
        
        
        instance.orders.create({amount,currency:"INR"},(err,result)=>{
            if(err){
                throw new Error(JSON.stringify(err))
            }
            
            req.user.createOrder({orderid:result.id,status:"PENDING"})
            .then(()=>{
                return res.status(201).json({
                    order,
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