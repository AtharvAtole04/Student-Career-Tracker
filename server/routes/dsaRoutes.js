const express = require('express');
const router = express.Router();
const {
  getDsaProgress,
  createDsaProgress,
  updateDsaProgress,
  deleteDsaProgress,
} = require('../controllers/dsaController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require student authentication
router.use(protect);
router.use(authorize('student'));

router.route('/')
  .get(getDsaProgress)
  .post(createDsaProgress);

router.route('/:id')
  .put(updateDsaProgress)
  .delete(deleteDsaProgress);

module.exports = router;
