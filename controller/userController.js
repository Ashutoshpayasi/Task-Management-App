const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const sendEmail = require("../config/sendEmailconfig");
const crypto = require("crypto");
const mailOptions = require("../config/EmailTemplate");
const generateOTP = require("../utils/generateOtp");
const mongoose = require("mongoose");

const CreateUser = asyncHandler(async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        error:
          "Please provide all required fields: firstName, lastName, email, and password",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email already registered",
      });
    }

    // Hash password and generate OTP
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP(); // Generate OTP for email verification
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
      isEmailVerified: false,
    });

    // Send verification email
    let emailSent = false;
    const verificationMessage = `Your OTP for email verification is: ${otp}. It will expire in 10 minutes.`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Email Verification",
        text: verificationMessage,
      });
      emailSent = true;
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    return res.status(201).json({
      success: true,
      message: emailSent
        ? "User created successfully. Please check your email for OTP verification."
        : "User created successfully, but there was an issue sending the verification email. Please request a new OTP.",
      user: {
        id: user._id,
        email: user.email,
        isEmailVerified: false,
      },
      emailSent,
    });
  } catch (error) {
    console.error("User creation error:", error);
    return res.status(500).json({
      success: false,
      error: "There was an error during registration",
      message:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (user.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.status(200).json({ message: "Email verified successfully" });
});

// Add this function to handle resending OTP

const resendOTP = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.isVerified) {
    return res.status(400).json({ error: "Email already verified" });
  }

  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  const verificationMessage = `Your new OTP for email verification is: ${otp}. It will expire in 10 minutes.`;

  try {
    await sendEmail({
      to: user.email,
      subject: "New OTP for email verification",
      text: verificationMessage,
    });
    res.status(200).json({ message: "New OTP sent successfully" });
  } catch (error) {
    console.log("Error sending email:", error);
    res.status(500).json({ error: "Error sending new OTP email" });
  }
});

const LoginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "please add all the fields" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Invalid email or passowrd" });
    }

    //match password
    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch) {
      return res.status(401).json({ error: "Invalid email or passowrd" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(201).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "there is an error while login" });
  }
});

const GettingAllUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json({ message: "All user", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "there is an error" });
  }
});

const GettinguserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(400).json({ error: "Invalid user" });
  }
  res.status(200).json({ message: "user", user });
});

const UpdateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id);
    if (!user) {
      return res.status(400).json({ error: "Invalid user" });
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    const updatedUser = await user.save();
    res.status(200).json({
      message: "user updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "An Error while updating user" });
  }
});

const DeleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(400).json({ error: "Invalid user" });
    }
    await user.deleteOne();
    res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "An Error while deleting user" });
  }
});

//verified email

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return res
      .status(400)
      .json({ error: "Invalid or expired verification token" });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.status(200).json({ message: "Email verified successfully" });
});

//resetpassword

const resetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Generate a reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Save the token and expiration time (e.g., 1 hour) to user model
  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
  await user.save();

  // Send email with reset link
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/users/reset-password/${resetToken}`;

  const mailOption = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset",
    html: `<p>You requested a password reset</p>
             <p>Click this <a href="${resetUrl}">link</a> to reset your password</p>`,
  };

  await transporter.sendMail(mailOption);

  res.status(200).json({ message: "Reset link sent to your email" });
});

module.exports = {
  CreateUser,
  LoginUser,
  GettingAllUser,
  GettinguserById,
  UpdateUser,
  DeleteUser,
  verifyEmail,
  verifyOTP,
  resendOTP,
  resetPassword,
};
