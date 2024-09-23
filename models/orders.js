const mongoose = require('mongoose')

const Order = mongoose.model("order", new mongoose.Schema({
  
  paymentId: String,
  orderId: String,
  status: String,
  amount:Number,
  userId:mongoose.Schema.Types.ObjectId
  
}));

module.exports = Order
