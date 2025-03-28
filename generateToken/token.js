const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables

// Function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d", // Token expires in 1 day
  });
};

module.exports = generateToken;
