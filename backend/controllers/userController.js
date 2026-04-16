//crud operation for admin to manage users

const User = require("../models/User");

// @desc    Get all users (paginated,searchable,filterable)
// @route   GET /api/users
// @access  Admin, manager

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    //Filter object
    const filter = {};

    if (req.query.role) {
      filter.role = req.query.role;
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ];
    }

    //Manager cannot see admin users
    if (req.user.role === "manager") {
      filter.role = { $ne: "admin" };
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      users,
      page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Admin, manager

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //Manager cannot view admin users
    if (req.user.role === "manager" && user.role === "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to view this user" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Admin only
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password: password || "Password@123", // default password if not provided
      role: role || "user",
      status: status || "active",
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdBy: user.createdBy,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Admin (any user), Manager (non-admin only), User (own profile only)
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Regular user can only update their own profile
    if (
      req.user.role === "user" &&
      req.user._id.toString() !== user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this user" });
    }

    // Manager cannot update admin users
    if (req.user.role === "manager" && user.role === "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update admin users" });
    }

    // Regular user cannot change their own role
    if (req.user.role === "user" && req.body.role) {
      return res.status(403).json({ message: "Not authorized to change role" });
    }

    // Update fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.status = req.body.status || user.status;
    user.updatedBy = req.user._id;

    // Only admin can change roles
    if (req.user.role === "admin" && req.body.role) {
      user.role = req.body.role;
    }

    // Update password only if provided
    if (req.body.password) {
      user.password = req.body.password; // pre('save') hook will hash it
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
      updatedBy: updatedUser.updatedBy,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Soft delete (deactivate) user
// @route   DELETE /api/users/:id
// @access  Admin only
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Cannot deactivate yourself
    if (req.user._id.toString() === user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot deactivate your own account" });
    }

    user.status = "inactive";
    user.updatedBy = req.user._id;
    await user.save();

    res.json({ message: "User deactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get own profile
// @route   GET /api/users/profile
// @access  Private (any logged in user)
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getMyProfile,
};
