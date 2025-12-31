const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, default: "admin" },
  avatar: { type: String, default: "https://res.cloudinary.com/dvwqnzsgx/image/upload/v1767095412/asadjn99_16kb_jjstuw.jpg" }, // URL for profile pic
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);