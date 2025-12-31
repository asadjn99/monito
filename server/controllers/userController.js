const User = require("../models/userModel");

// 1. Get Admin Profile (For now, we fetch the first admin found)
exports.getProfile = async (req, res) => {
  try {
    // In a real app with Auth, we would use req.user.id
    // For this setup, we get the first user marked as 'admin'
    let user = await User.findOne({ role: "admin" });

    // If no admin exists yet, create a default one
    if (!user) {
      user = await User.create({
        name: "Super Admin",
        email: "admin@monito.com",
        password: "asadjn99",
        phone: "+92 307 5993029",
        role: "admin"
      });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Update Profile
exports.updateProfile = async (req, res) => {
  try {
    // Update the first admin found
    const user = await User.findOneAndUpdate({ role: "admin" }, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};