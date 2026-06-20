const User = require('../models/User');
const DsaProgress = require('../models/DsaProgress');
const JobApplication = require('../models/JobApplication');

// @desc    Get aggregate stats for admin
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalApplications = await JobApplication.countDocuments();
    const totalDsaRecords = await DsaProgress.countDocuments();

    // Get 5 most recent registrations
    const recentRegistrations = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    return res.json({
      success: true,
      data: {
        totalStudents,
        totalApplications,
        totalDsaRecords,
        recentRegistrations,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all student profiles
// @route   GET /api/admin/students
// @access  Private (Admin)
const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get progress details for a specific student
// @route   GET /api/admin/students/:id/progress
// @access  Private (Admin)
const getStudentProgress = async (req, res) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: 'student' }).select('-password');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const dsaProgress = await DsaProgress.find({ userId: req.params.id }).sort({ createdAt: -1 });
    const jobApplications = await JobApplication.find({ userId: req.params.id }).sort({ applicationDate: -1 });

    return res.json({
      success: true,
      data: {
        student,
        dsaProgress,
        jobApplications,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAllStudents,
  getStudentProgress,
};
