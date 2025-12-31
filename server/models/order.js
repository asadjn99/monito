const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pinCode: { type: Number, required: true },
    phoneNo: { type: String, required: true },
  },
  // SIMPLIFIED: Storing user details directly
  user: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    id: { type: String, required: true } 
  },
  orderItems: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      product: { type: String, required: true },
    },
  ],
  paymentInfo: {
    id: { type: String }, 
    status: { type: String, required: true },
    type: { type: String },
    screenshot: { type: String },
  },
  itemsPrice: { type: Number, default: 0 },
  taxPrice: { type: Number, default: 0 },
  shippingPrice: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 },
  
  // UPDATED: Professional Statuses
  orderStatus: { 
    type: String, 
    required: true, 
    default: "Order Placed",
    enum: [
      "Order Placed", 
      "Confirmed", 
      "Preparing", 
      "Out for Delivery", 
      "Delivered", 
      "Cancelled"
    ]
  },
  
  // UPDATED: Reason for cancellation
  cancellationReason: { type: String, default: null },
  
  deliveredAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);