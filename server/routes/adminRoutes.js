const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllStudents,
  getStudentProgress,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require admin role authorization
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/students', getAllStudents);
router.get('/students/:id/progress', getStudentProgress);

module.exports = router;
