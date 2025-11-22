// server/controllers/taskController.js
const { validationResult } = require('express-validator');
const Task = require('../models/Task');


exports.getTasks = async (req, res, next) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    
    let query = { user: req.user.id };
    
    // Filter by status
    if (status && ['todo', 'in-progress', 'completed'].includes(status)) {
      query.status = status;
    }
    
    // Filter by priority
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      query.priority = priority;
    }

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      count: tasks.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};


exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const task = await Task.create({
      ...req.body,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      data: task
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    let task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};


exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};