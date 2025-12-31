import mongoose from 'mongoose';

const PetSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Manual ID (MO231)
  title: { type: String, required: true },
  category: { type: String, required: true }, // e.g., Dog, Cat
  breed: { type: String }, // e.g., Pomeranian, Persian
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  age: { type: String, required: true },
  price: { type: String, required: true }, // Keep as string for currency formatting
  imageUrl: { type: String, required: true }, // Main thumbnail image
  // 👇 NEW FIELDS
  description: { type: String, required: true },
  healthGuarantee: { type: Boolean, default: true },
  images: [{ type: String }], // Array of additional image URLs
  color: { type: String },
}, { timestamps: true });

export default mongoose.models.Pet || mongoose.model('Pet', PetSchema);