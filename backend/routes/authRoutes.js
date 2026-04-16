const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} = require("../controllers/authController");

router.post(
  "/register",
  (req, res, next) => {
    console.log("ROUTE HIT");
    next();
  },
  registerUser,
);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);

module.exports = router;
