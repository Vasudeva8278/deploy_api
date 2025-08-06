const express = require("express");
const router = express.Router();

// Check if userController exists
const userController = require("../controllers/userController");

const {
  signup,
  login,
  forgotPassword,
  getUsers,
  getOrgUsers,
  getUser,
  updateUser,
  updateUserRole,
  deleteUser,
  getUserProfile,
  logout,
  logoutAll,
  createUser,
  resetPassword,
  verifyEmail,
  googleAuthUser,
  changePassword,
  getAllUsers,
} = userController;

const { auth } = require("../middleware/auth");

// Get user profile
router.get("/me", auth, getUserProfile);
router.put("/role/:id", auth, updateUserRole);

// Sign up a new user
// POST /signup expects { user: { name, email, password, profilePic (filename) } }
router.post("/signup", signup);

// Log in an existing user
router.post("/login", login);

//to use google token for authentication and authorise with app generated token
router.post("/google-auth", googleAuthUser);

// Forgot password
router.post("/forgotPassword", forgotPassword);

// Create a new user
router.post("/createUser", auth, createUser);

// Get all users
router.get("/", auth, getUsers);

router.get("/verify-email/:token", verifyEmail);
// Get all users for an organization
router.get("/orgUsers", auth, getOrgUsers);

// Get all users for an organization
router.get("/getalluser", auth, getAllUsers);

// Get a specific user
router.get("/:id", auth, getUser);

// Update a user
// PUT /update-status/:id expects { profilePic (filename), ...other fields }
router.put("/update-status/:id", auth, updateUser);
router.post("/reset-password/:token", resetPassword);

router.post("/change-password", auth, changePassword);

// Delete a user
router.delete("/delete/:id", auth, deleteUser);

// Logout user
router.post("/logout", auth, logout);

// Logout user from all devices
router.post("/logoutAll", auth, logoutAll);

module.exports = router;
