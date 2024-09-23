const Razorpay = require("razorpay");
const Order = require("../models/orders");
const User = require("../models/Users");
const jwt = require("jsonwebtoken");
exports.purchasePremium = async (req, res, next) => {
  try {
    // Initialize Razorpay instance
    var instance = new Razorpay({
      key_id: process.env.Key_id,
      key_secret: process.env.Key_Secret,
    });

    const amount = 100; // Amount in smallest currency unit (paisa for INR)

    // Create an order in Razorpay
    instance.orders.create({ amount, currency: "INR" }, async (err, result) => {
      if (err) {
        console.log("Error creating Razorpay order:", err);
        throw new Error(JSON.stringify(err));
      }
      console.log("Razorpay order created: ", result);
      console.log("22req user: ",req.user)

      // Create an order entry in Mongoose
      const newOrder = new Order({
        orderId: result.id,
        userId: req.user._id, // Link the order to the authenticated user
        status: "PENDING",
        amount,
      });

      try {
        // Save the order in MongoDB
        await newOrder.save();

        // Optionally, add the order to the user's order history (if defined in User schema)
        req.user.orders.push(newOrder._id); // Assuming an 'orders' array exists in the user schema
        await req.user.save();

        // Send response with Razorpay order details
        return res.status(201).json({
          result,
          key_id: instance.key_id,
        });
      } catch (saveError) {
        console.error("Error saving order in MongoDB:", saveError);
        throw new Error(saveError);
      }
    });
  } catch (error) {
    console.log("Error during premium purchase:", error);
    res.status(403).json({
      message: "Something went wrong",
      error: error.message || error,
    });
  }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    const { payment_id, order_id } = req.body;

    console.log("User ID: ", req.user._id, payment_id, order_id);

    // Update payment status and user premium status in parallel
    Promise.all([
      updatePaymentStatus(order_id, payment_id),
      updateUserPremiumStatus(req.user._id),
    ])
      .then((result) => {
        console.log("Result: ", result);

        // Generate a new JWT token for the premium user
        var token = jwt.sign({ id: req.user._id }, process.env.tokenSecret);

        return res.status(202).json({
          success: true,
          message: "Transaction successful",
          token,
        });
      })
      .catch((err) => {
        console.error("Error updating transaction:", err);
        throw new Error(err);
      });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({
      success: false,
      message: "Transaction failed",
    });
  }
};

// Function to update payment status in the Order model
async function updatePaymentStatus(orderId, payment_id) {
    return Order.findOneAndUpdate(
      { orderId: orderId },
      { paymentId: payment_id, status: true },
      { new: true } // To return the updated document
    );
  }
  
  // Function to update user's premium status in the User model
  async function updateUserPremiumStatus(userId) {
    return User.findOneAndUpdate(
      { _id: userId },
      { isPremiumUser: true },
      { new: true } // To return the updated document
    );
  }