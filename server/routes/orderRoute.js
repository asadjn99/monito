const express = require("express");
const router = express.Router();
const { 
    getSingleOrder, updateOrderStatus, updatePaymentStatus, seedOrder, getAllOrders, getFinanceStats, myOrders, newOrder // <--- Import this
} = require("../controllers/orderController");
router.route("/order/new").post(newOrder);
const { getProfile, updateProfile } = require("../controllers/userController"); // <--- Import User Controller

// --- ORDER ROUTES ---
router.route("/seed").get(seedOrder);
router.route("/admin/orders").get(getAllOrders);
router.route("/admin/finance").get(getFinanceStats); // <--- New Finance Route
router.route("/admin/orders/:id").get(getSingleOrder);
router.route("/admin/orders/:id/status").put(updateOrderStatus);
router.route("/admin/orders/:id/payment-status").put(updatePaymentStatus);
router.route("/my-orders").get(myOrders);
router.route("/seed").get(seedOrder);

// --- PROFILE ROUTES ---
router.route("/admin/profile").get(getProfile).put(updateProfile); // <--- New Profile Route

module.exports = router;