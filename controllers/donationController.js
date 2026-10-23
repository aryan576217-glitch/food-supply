const asyncHandler = require("../middleware/asyncHandler");
const DonationListing = require("../models/DonationListing");
const NGO = require("../models/NGO");
const ErrorResponse = require("../utils/errorResponse");
const { authorizeRoles } = require("../middleware/auth");

// POST /api/donations - business lists free surplus food
exports.createDonationListing = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    foodType,
    quantity,
    pickupAddress,
    pickupWindowStart,
    pickupWindowEnd,
    expiresAt,
  } = req.body;

  const listing = await DonationListing.create({
    business: req.user.id,
    title,
    description,
    foodType,
    quantity,
    pickupAddress,
    pickupWindowStart,
    pickupWindowEnd,
    expiresAt,
    isFree: true,
  });

  res.status(201).json({ success: true, data: listing });
});

// GET /api/donations/available - NGOs view unclaimed free donations
exports.getAvailableDonations = asyncHandler(async (req, res, next) => {
  const now = new Date();
  const listings = await DonationListing.find({
    isFree: true,
    isClaimed: false,
    expiresAt: { $gt: now },
  }).sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: listings.length, data: listings });
});

// POST /api/donations/:id/claim - NGO claims a free donation
exports.claimDonation = asyncHandler(async (req, res, next) => {
  const listing = await DonationListing.findById(req.params.id);

  if (!listing) {
    return next(new ErrorResponse("Donation listing not found", 404));
  }

  if (!listing.isFree) {
    return next(new ErrorResponse("This listing is not a free donation", 400));
  }

  if (listing.isClaimed) {
    return next(new ErrorResponse("This donation has already been claimed", 400));
  }

  if (new Date() > listing.expiresAt) {
    return next(new ErrorResponse("This donation has expired", 400));
  }

  const ngo = await NGO.findById(req.user.id);
  if (!ngo || !ngo.isVerified) {
    return next(new ErrorResponse("Only verified NGOs can claim donations", 403));
  }

  listing.isClaimed = true;
  listing.claimedBy = ngo._id;
  listing.claimedAt = new Date();
  await listing.save();

  res.status(200).json({ success: true, data: listing });
});

// GET /api/donations/my-claims - NGO views its claimed donations
exports.getMyClaims = asyncHandler(async (req, res, next) => {
  const claims = await DonationListing.find({
    claimedBy: req.user.id,
  }).sort({ claimedAt: -1 });

  res.status(200).json({ success: true, count: claims.length, data: claims });
});

// GET /api/donations/my-listings - business views its donation listings
exports.getMyListings = asyncHandler(async (req, res, next) => {
  const listings = await DonationListing.find({
    business: req.user.id,
  }).sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: listings.length, data: listings });
});
