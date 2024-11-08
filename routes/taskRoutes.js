const express = require("express");
const router = express.Router();
const hasPermission = require("../middlewalre/rollBasedControl");
const Task = require("../models/TaskModel");
const taskController = require("../controller/taskController");

// Task Endpoint Routes with RBAC
router.post(
  "/tasks",
  hasPermission(["tasks:create"]),
  taskController.createTask
);
router.get("/tasks", hasPermission(["tasks:read"]), taskController.getTasks);
router.patch(
  "/tasks/:id",
  hasPermission(["tasks:update"]),
  taskController.updateTask
);
router.delete(
  "/tasks/:id",
  hasPermission(["tasks:delete"]),
  taskController.deleteTask
);

module.exports = router;