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

const loginUser = async(req, res) => {
    try {
     const {email, password} =  req.body
 
      if(!email, !password){
        return res.status(400).json({message: "All fields are required"})
      }
       const findUser = await User.findOne({email})
 
       if(!findUser){
         return res.status(404).json({message: "User not found"})
       }
      
        const comparePassword = await bcrypt.compare(password,findUser.password)

        if(!comparePassword){
         return res.status(400).json({message: "Invalid password", error: true, success: false})
        }
         const acessToken = await generateToken(findUser._id)
 
         const cookiesOption = {
           httpOnly : true,
           secure : true,
           sameSite : "None"
       }
      
       res.cookie("token",acessToken, cookiesOption)
       return res.status(200).json({
         message:"User Login Successfully",
         sucess:true,
         error:false,
         data:{
           findUser,
           acessToken,
         }
       })
     
    } catch (error) {
     return res.status(400).json({
       message:"Login Failed",
       sucess:false,
       error:true
     })
     
    }
  }
 



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
