# Free Food Donation Feature (NGO-only claiming)

## Overview
Added a feature where food businesses can list surplus food as a **free donation**, and only **verified NGOs** can view and claim it. Regular customers cannot take free donations.

## Files
- `models/DonationListing.js` — donation listing schema with TTL expiry index
- `models/NGO.js` — NGO account model with verification flag
- `controllers/donationController.js` — create, list available, claim, my claims, my listings
- `middleware/auth.js` — JWT protect + role-based authorization
- `middleware/ngoOnly.js` — restricts claiming to NGOs
- `routes/donations.js` — API routes with role guards
- `middleware/error.js` — centralized error handler
- `server.js` — Express app entry point

## API Endpoints
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/donations | business | List free surplus food |
| GET | /api/donations/available | ngo | View unclaimed free donations |
| POST | /api/donations/:id/claim | ngo (verified) | Claim a free donation |
| GET | /api/donations/my-claims | ngo | View NGO's claimed donations |
| GET | /api/donations/my-listings | business | View business's listings |

## Key rules
- Free donations are flagged `isFree: true`
- Only `role: "ngo"` users can access `/available` and claim
- NGOs must be `isVerified: true` to claim
- A listing can only be claimed once (`isClaimed`)
- Expired listings are not claimable and auto-removed via TTL index

## Setup
```bash
cd food-surplus-app
npm install
cp .env.example .env  # set MONGO_URI, JWT_SECRET, NODE_ENV, PORT
npm run dev
```

## .env example
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/foodsurplus
JWT_SECRET=your-secret
NODE_ENV=development
```
