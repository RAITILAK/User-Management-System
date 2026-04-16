//login, register, logout logic here

const User = require("../models/User");
const {
  generateAccessToken,
  generateRefereshToken,
} = require("../utils/generateToken");
const jwt = require("jsonwebtoken");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    //Check if usewr already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    //Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || "user",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  } catch (error) {
    console.error(
      "REGISTER ERROR FULL:",
      error.name,
      error.message,
      error.stack,
    );
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user and get token
// @route   POST /api/auth/login
// @access  Public

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Find user and check include password (since in schema select:false)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //Check if user is active
    if (user.status === "inactive") {
      return res
        .status(403)
        .json({ message: "Account is deactivated. Contact admin" });
    }

    //Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //Generate tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefereshToken(user._id, user.role);

    //Send refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days in ms
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    access token using refresh token
// @route   POST /api/auth/refresh-token
// @access  Public(uses httponly cookie)

const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.status === "inactive") {
      return res
        .status(403)
        .json({ message: "Invalid token or user inactive" });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id, user.role);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

// @desc    Logout user (clear refresh token cookie)
// @route   POST /api/auth/logout
// @access  Public

const logoutUser = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logged out successfully" });
};

module.exports = { registerUser, loginUser, refreshAccessToken, logoutUser };
