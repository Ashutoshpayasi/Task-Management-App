const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewalre/AuthMiddleware");
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const userController = require("../controller/userController");

// Corrected the path '/regester' to '/register'
router.post("/user/register", userController.CreateUser);
router.post("/user/verifyotp", userController.verifyOTP);
router.post("/user/resendotp", userController.resendOTP);
router.post("/user/login", authMiddleware, userController.LoginUser);
router.get("/user/getalluser", userController.GettingAllUser);
router.get("/user/:id", userController.GettinguserById);
router.put("/user/:id", userController.UpdateUser);
router.post("/user/resetpassword", userController.resetPassword);
router.delete("/user/:id", userController.DeleteUser);
router.get("/verify-email/:token", userController.verifyEmail);

router.post(
  "/user/reset-password/:token",
  asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    // Find user by reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, // Check if the token has not expired
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Hash the new password and save it
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined; // Clear the token
    user.resetTokenExpiry = undefined; // Clear the expiry
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  })
);

module.exports = router;
