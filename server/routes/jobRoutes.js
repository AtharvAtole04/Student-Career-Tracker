const express = require('express');
const router = express.Router();
const {
  getJobApplications,
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require student authentication
router.use(protect);
router.use(authorize('student'));

router.route('/')
  .get(getJobApplications)
  .post(createJobApplication);

router.route('/:id')
  .put(updateJobApplication)
  .delete(deleteJobApplication);

module.exports = router;
