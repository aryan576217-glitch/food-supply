const mongoose = require("mongoose");

const donationListingSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    foodType: { type: String, trim: true },
    quantity: { type: String, trim: true },
    pickupAddress: { type: String, required: true, trim: true },
    pickupWindowStart: { type: Date, required: true },
    pickupWindowEnd: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    isClaimed: { type: Boolean, default: false },
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: "NGO" },
    claimedAt: { type: Date },
  },
  { timestamps: true }
);

donationListingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("DonationListing", donationListingSchema);
