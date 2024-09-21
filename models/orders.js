const mongoose = require('mongoose')

const Order = mongoose.model("order", new mongoose.Schema({
  
  paymentId: String,
  orderId: String,
  status: String,
  
}));

module.exports = Order
