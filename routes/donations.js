const express = require("express");
const router = express.Router();
const {
  createDonationListing,
  getAvailableDonations,
  claimDonation,
  getMyClaims,
  getMyListings,
} = require("../controllers/donationController");
const { protect, authorizeRoles } = require("../middleware/auth");
const ngoOnly = require("../middleware/ngoOnly");

// Businesses list free surplus food
router.post(
  "/",
  protect,
  authorizeRoles("business"),
  createDonationListing
);

// NGOs view available free donations
router.get(
  "/available",
  protect,
  authorizeRoles("ngo"),
  getAvailableDonations
);

// NGO claims a free donation
router.post(
  "/:id/claim",
  protect,
  authorizeRoles("ngo"),
  ngoOnly,
  claimDonation
);

// NGO views its claims
router.get("/my-claims", protect, authorizeRoles("ngo"), getMyClaims);

// Business views its listings
router.get("/my-listings", protect, authorizeRoles("business"), getMyListings);

module.exports = router;
