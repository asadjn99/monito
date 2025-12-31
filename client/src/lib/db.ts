// lib/db.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jnasad07_db_user:<gTAEmapfDNCRiluj>@cluster0monito.ofvx4df.mongodb.net/?appName=Cluster0monito';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDB;

// DB
// gTAEmapfDNCRiluj
// jnasad07_db_user

// 'mongodb+srv://jnasad07_db_user:<gTAEmapfDNCRiluj>@cluster0monito.ofvx4df.mongodb.net/?appName=Cluster0monito';






