const { default: mongoose, Schema } = require("mongoose");

const ForgotPasswordRequests = mongoose.model('forgotPasswordRequest', new Schema({
  
  isactive: {
    type: Boolean,
    required: true,
  },
 
}));

module.exports = ForgotPasswordRequests;