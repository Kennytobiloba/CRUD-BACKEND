const express = require("express");
const bcrypt = require("bcryptjs"); // Import bcrypt
const User = require("../model/user.model");
const generateToken = require("../generateToken/token");

const router = express.Router();

// Create a new user
router.post("/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create User" });
  }
});
// login user

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password", success: false });
    }

    // Generate JWT Token
    const accessToken = await generateToken(user._id);

    // Set cookie options for security
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("token", accessToken, cookieOptions);

    return res.status(200).json({
      message: "User login successful",
      success: true,
      data: {
        user,
        accessToken,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Login failed", success: false, error: error.message });
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ message: "Internal server error", success: false, error: error.message });
  }
});



// get all user route
router.get('/users', async (req, res) => {
    try {
      const users = await User.find(); 
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
    
  });

 

module.exports = router;
