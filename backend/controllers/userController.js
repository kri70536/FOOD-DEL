import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Function to create a JWT token
const createToken = (id) => {
  try {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  } catch (error) {
    console.error("JWT Token Error:", error);
    return null;
  }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if user exists
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ success: false, message: "User not found" });
      }
  
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Invalid credentials" });
      }
  
      // Generate token
      const token = createToken(user._id);
  
      res.status(200).json({ 
        success: true, 
        token, 
        cartData: user.cartData // Send cart data with login response
      });
  
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  
// Register user
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;

  try {
    // Check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Please enter a strong password (at least 8 characters)" });
    }

    // Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    if (!token) {
      return res.status(500).json({ success: false, message: "Error generating token" });
    }

    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { loginUser, registerUser };
