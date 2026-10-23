const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

// Restrict donation claiming to NGOs only
exports.ngoOnly = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "ngo") {
    return next(
      new ErrorResponse("Only NGOs can claim free food donations", 403)
    );
  }
  next();
});
