
  const asyncHandler = require('express-async-handler');
  const Task = require('../models/TaskModel');
  // Task CRUD Operations
  const createTask = asyncHandler(async (req, res) => {
    try {
      const { title, description, assignedTo } = req.body;
      const user = req.user; // Assuming you have a middleware that attaches the user to the request object
  
      const task = await Task.create({
        title,
        description,
        assignedTo,
        createdBy: user._id
      });
  
      res.status(201).json({ success: true, task });
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ success: false, message: 'Error creating task' });
    }
  });
  
  const getTasks = asyncHandler(async (req, res) => {
    try {
      const user = req.user;
      const tasks = await Task.find({ $or: [{ assignedTo: user._id }, { createdBy: user._id }] });
      res.status(200).json({ success: true, tasks });
    } catch (error) {
      console.error('Error retrieving tasks:', error);
      res.status(500).json({ success: false, message: 'Error retrieving tasks' });
    }
  });
  
  const updateTask = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, status, assignedTo } = req.body;
      const user = req.user;
  
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
  
      // Only allow updates if the user is the creator or the assigned user
      if (task.createdBy.toString() !== user._id.toString() && task.assignedTo.toString() !== user._id.toString()) {
        return res.status(403).json({ success: false, message: 'You are not authorized to update this task' });
      }
  
      task.title = title || task.title;
      task.description = description || task.description;
      task.status = status || task.status;
      task.assignedTo = assignedTo || task.assignedTo;
      task.updatedAt = Date.now();
      await task.save();
  
      res.status(200).json({ success: true, task });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ success: false, message: 'Error updating task' });
    }
  });
  
  const deleteTask = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user;
  
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
  
      // Only allow deletion if the user is the creator
      if (task.createdBy.toString() !== user._id.toString()) {
        return res.status(403).json({ success: false, message: 'You are not authorized to delete this task' });
      }
  
      await task.remove();
      res.status(200).json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ success: false, message: 'Error deleting task' });
    }
  });
  
  module.exports = { createTask, getTasks, updateTask, deleteTask };