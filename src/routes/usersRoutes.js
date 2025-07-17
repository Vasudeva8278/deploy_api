const express = require("express");
const router = express.Router();

// Check if userController exists
const userController = require("../controllers/userController");
console.log("userController loaded:", !!userController);

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

// Debug: Check if all functions are defined
console.log("Checking userController functions:");
console.log("signup:", typeof signup);
console.log("login:", typeof login);
console.log("updateUser:", typeof updateUser);
console.log("updateUserRole:", typeof updateUserRole);
console.log("getUserProfile:", typeof getUserProfile);
console.log("logout:", typeof logout);
console.log("logoutAll:", typeof logoutAll);
console.log("createUser:", typeof createUser);
console.log("resetPassword:", typeof resetPassword);
console.log("verifyEmail:", typeof verifyEmail);
console.log("googleAuthUser:", typeof googleAuthUser);
console.log("changePassword:", typeof changePassword);
console.log("getAllUsers:", typeof getAllUsers);

const { auth, admin, orgAdmin } = require("../middleware/auth");

// Debug: Check if middleware functions are defined
console.log("auth middleware:", typeof auth);
console.log("admin middleware:", typeof admin);
console.log("orgAdmin middleware:", typeof orgAdmin);

// Get user profile
router.get("/me", auth, getUserProfile);
router.put("/role/:id", auth, orgAdmin, updateUserRole);
// Sign up a new user
// POST /signup expects { user: { name, email, password, profilePic (filename) } }
router.post("/signup", signup);

// Log in an existing user
router.post("/login", login);

//to use google token for authentication and authorise with app generated token
router.post("/google-auth", googleAuthUser);

// Forgot password
router.post("/forgotPassword", forgotPassword);

// Create a new user (OrgAdmin or SuperAdmin)
router.post("/createUser", auth, orgAdmin, createUser);

// Get all users (SuperAdmin only)
router.get("/", auth, admin, getUsers);



router.get("/verify-email/:token", verifyEmail);
// Get all users for an organization (OrgAdmin or SuperAdmin)
router.get("/orgUsers", auth, orgAdmin, getOrgUsers);

// Get all users for an organization (OrgAdmin or SuperAdmin)
router.get("/getalluser", getAllUsers);

// Get a specific user (OrgAdmin or SuperAdmin)
router.get("/:id", auth, orgAdmin, getUser);

// Update a user (OrgAdmin or SuperAdmin)
// PUT /update-status/:id expects { profilePic (filename), ...other fields }
router.put("/update-status/:id", updateUser);
router.post("/reset-password/:token", resetPassword);

router.post("/change-password", auth, changePassword);

// Delete a user (OrgAdmin or SuperAdmin)
router.delete("/delete/:id", deleteUser);

// Logout user
router.post("/logout", auth, logout);

// Logout user from all devices
router.post("/logoutAll", auth, logoutAll);

module.exports = router;
