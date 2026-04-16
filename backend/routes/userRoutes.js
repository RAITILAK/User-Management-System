const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getMyProfile,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

// Own profile — must be above /:id so it doesn't get caught as an ID
router.get("/profile", protect, getMyProfile);

// Admin + Manager routes
router.get("/", protect, authorizeRoles("admin", "manager"), getAllUsers);
router.get("/:id", protect, authorizeRoles("admin", "manager"), getUserById);

// Admin only routes
router.post("/", protect, authorizeRoles("admin"), createUser);

// Admin + Manager + User (controller handles fine-grained permission)
router.put("/:id", protect, updateUser);

// Admin only
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

module.exports = router;
