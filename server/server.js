const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// 1. Middleware
app.use(express.json());
app.use(cors()); // Allows Next.js frontend to talk to this server

// 2. Database Connection
const connectDatabase = () => {
// No options needed anymore
// mongodb+srv://jnasad07_db_user:<db_password>@cluster0.wu018rf.mongodb.net/?appName=Cluster0
mongoose.connect("mongodb+srv://jnasad07_db_user:mypetpassword123@cluster0.wu018rf.mongodb.net/?appName=Cluster0")
 .then(() => console.log("Connected to Cloud Database!"))
  .catch((err) => console.log("Connection Failed:", err));
};

connectDatabase();

// 3. Import Routes
const order = require("./routes/orderRoute");

// 4. Use Routes
app.use("/api/v1", order);

// 5. Start Server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is working on http://localhost:${PORT}`);
});