const Order = require("../models/order"); // Ensure path matches your filename

// 1. Get Single Order
exports.getSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      _id: order._id,
      createdAt: order.createdAt,
      status: order.orderStatus,
      cancellationReason: order.cancellationReason,
      totalAmount: order.totalPrice,
      items: order.orderItems,
      user: order.user,
      shippingAddress: {
        address: order.shippingInfo.address,
        city: order.shippingInfo.city,
        postalCode: order.shippingInfo.pinCode,
        country: order.shippingInfo.country,
        phone: order.shippingInfo.phoneNo
      },
      paymentInfo: {
        method: order.paymentInfo.type || "Bank Transfer",
        transactionId: order.paymentInfo.id,
        status: order.paymentInfo.status,
        screenshot: order.paymentInfo.screenshot
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Update Status (Admin)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Update the status
    order.orderStatus = req.body.status;

    // Handle Cancellation Reason
    if (req.body.status === "Cancelled") {
      order.cancellationReason = req.body.reason || "Administrative Decision";
    } else {
      // If status is changed back from Cancelled, clear the reason
      order.cancellationReason = null;
    }

    // Handle Delivery Timestamp
    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save();
    
    res.status(200).json({
      success: true, 
      message: "Status updated", 
      order 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Update Payment Status (Admin)
exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentInfo.status = req.body.status;
    await order.save();

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. CREATE DUMMY ORDER (Seed)
exports.seedOrder = async (req, res) => {
    try {
        const dummyOrder = await Order.create({
            shippingInfo: {
                address: "House 99, Street 1, Bahria Town",
                city: "Lahore",
                state: "Punjab",
                country: "Pakistan",
                pinCode: 54000,
                phoneNo: "+92 321 0000000"
            },
            user: {
                name: "Ali Khan",
                email: "ali@test.com",
                phone: "+92 321 0000000",
                id: "USER-123"
            },
            orderItems: [
                {
                    name: "Persian Cat",
                    price: 25000,
                    quantity: 1,
                    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
                    product: "prod-1"
                }
            ],
            paymentInfo: {
                id: "TRX-999-888",
                status: "Pending",
                type: "EasyPaisa",
                screenshot: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d"
            },
            totalPrice: 25000,
            orderStatus: "Order Placed"
        });
        res.status(201).json({ success: true, message: "Dummy Order Created!", id: dummyOrder._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// 5. GET ALL ORDERS (Dashboard Data)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // Newest first

    // Calculate Dashboard Counts
    const totalOrders = orders.length;
    const newOrders = orders.filter(o => o.orderStatus === "Order Placed").length;
    
    // Active: Confirmed, Preparing, or Out for Delivery
    const activeOrders = orders.filter(o => ["Confirmed", "Preparing", "Out for Delivery"].includes(o.orderStatus)).length;
    
    const deliveredOrders = orders.filter(o => o.orderStatus === "Delivered").length;
    const rejectedOrders = orders.filter(o => o.orderStatus === "Cancelled").length;

    res.status(200).json({
      success: true,
      totalOrders,
      newOrders,
      activeOrders,
      deliveredOrders,
      rejectedOrders,
      orders // The actual list of orders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. GET FINANCE STATS
exports.getFinanceStats = async (req, res) => {
  try {
    const orders = await Order.find();

    // 1. Calculate Total Revenue (Only from non-cancelled orders)
    const validOrders = orders.filter(o => o.orderStatus !== 'Cancelled');
    const totalRevenue = validOrders.reduce((acc, item) => acc + item.totalPrice, 0);

    // 2. Calculate Pending Payments (Orders not yet Verified)
    const pendingAmount = validOrders
      .filter(o => o.paymentInfo.status !== 'Verified')
      .reduce((acc, item) => acc + item.totalPrice, 0);

    // 3. Count Orders
    const totalSales = validOrders.length;

    // 4. Recent Transactions (Last 5)
    const recentTransactions = await Order.find()
      .select("totalPrice paymentInfo createdAt user orderStatus")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      totalRevenue,
      pendingAmount,
      totalSales,
      recentTransactions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 7. GET MY ORDERS (For Logged in User)
exports.myOrders = async (req, res) => {
  try {
    const { email } = req.query; // We will pass email in the URL
    
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Find orders where the stored user.email matches the logged-in email
    const orders = await Order.find({ "user.email": email }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 8. CREATE NEW ORDER (Checkout)
exports.newOrder = async (req, res, next) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      user // Frontend must send user details { name, email, id }
    } = req.body;

    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      orderStatus: "Order Placed", // Default status
      user: {
        name: user.name,
        email: user.email,
        phone: shippingInfo.phoneNo, // Use phone from shipping
        id: user._id || user.id || "guest"
      }
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};