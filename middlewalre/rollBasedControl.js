const asyncHandler = require("express-async-handler");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// RBAC Middleware
const hasPermission = (requiredPermissions) => {
    return asyncHandler(async (req, res, next) => {
      try {
        const user = req.user;
        if (user.role.permissions.some(perm => requiredPermissions.includes(perm))) {
          next();
        } else {
          return res.status(403).json({ success: false, message: 'Forbidden' });
        }
      } catch (error) {
        console.error('Error in hasPermission middleware:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
    });
  };

  
module.exports = hasPermission;
