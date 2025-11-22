// server/routes/taskRoutes.js
const express = require('express');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');
const { validateTask } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(validateTask, createTask);

router.route('/:id')
  .get(getTask)
  .put(validateTask, updateTask)
  .delete(deleteTask);

module.exports = router;