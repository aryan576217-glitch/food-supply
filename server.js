const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const donationRoutes = require("./routes/donations");
const errorHandler = require("./middleware/error");

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/donations", donationRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    );
  })
  .catch((err) => console.error(err));

module.exports = app;
