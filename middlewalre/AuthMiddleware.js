const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //getting token from header
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //get user from token
      req.user = await User.findById(decoded.id).select("-password"); //excluding password fom user oject
      next();
    } catch (err) {
      console.log(err);
      res.status(401).json({ err: "Not Authorized" });
    }
    if (!token) {
      return res.status(401).json({ error: "Not authorized, no token" });
    }
  }
});

module.exports = authMiddleware;
 