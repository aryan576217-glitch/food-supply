const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    registrationNumber: { type: String, trim: true },
    address: { type: String, trim: true },
    contactPerson: { type: String, trim: true },
    contactPhone: { type: String, trim: true },
    isVerified: { type: Boolean, default: false },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NGO", ngoSchema);
