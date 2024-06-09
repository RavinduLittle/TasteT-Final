import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error logging in" });
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Register user
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    // Check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[!@#$%^&*])/; // Regular expression for at least one special character
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password (need 8 characters)",
      });
    }

    if (password.length > 15) {
      return res.json({
        success: false,
        message: "Password can't exceed 15 characters",
      });
    }

    if (!passwordRegex.test(password)) {
      return res.json({
        success: false,
        message: "Password must contain at least one special character",
      });
    }

    // Email validation - advanced
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400);
      throw new Error("Please provide a valid email address");
    }

    // // Name validation - advanced
    // if (!name || typeof name !== "string" || name.trim().length === 0) {
    //   res.status(400);
    //   throw new Error("Please provide a valid name");
    // }
    if (/[\d!@#$%^&*()_+={}\[\]:";'<>?,.\/\\|`~]/.test(name)) {
      res.status(400);
      throw new Error("Name cannot contain numbers or symbols");
    }

    // Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error registering user" });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId);
    res.json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching user details" });
  }
};

export { loginUser, registerUser, getUserDetails };
