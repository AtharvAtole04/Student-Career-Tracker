const JobApplication = require('../models/JobApplication');

// @desc    Get all job applications for current user
// @route   GET /api/jobs
// @access  Private (Student)
const getJobApplications = async (req, res) => {
  try {
    const jobs = await JobApplication.find({ userId: req.user.id }).sort({ applicationDate: -1 });
    return res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new job application
// @route   POST /api/jobs
// @access  Private (Student)
const createJobApplication = async (req, res) => {
  try {
    const { companyName, role, applicationDate, status, notes } = req.body;

    if (!companyName || !role) {
      return res.status(400).json({ success: false, message: 'Please add company name and role' });
    }

    const job = await JobApplication.create({
      userId: req.user.id,
      companyName,
      role,
      applicationDate: applicationDate || Date.now(),
      status: status || 'Applied',
      notes,
    });

    return res.status(201).json({ success: true, data: job });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a job application
// @route   PUT /api/jobs/:id
// @access  Private (Student)
const updateJobApplication = async (req, res) => {
  try {
    const { companyName, role, applicationDate, status, notes } = req.body;

    let job = await JobApplication.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job application not found' });
    }

    // Verify ownership
    if (job.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this application' });
    }

    job.companyName = companyName || job.companyName;
    job.role = role || job.role;
    job.applicationDate = applicationDate || job.applicationDate;
    job.status = status || job.status;
    job.notes = notes !== undefined ? notes : job.notes;

    const updatedJob = await job.save();
    return res.json({ success: true, data: updatedJob });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a job application
// @route   DELETE /api/jobs/:id
// @access  Private (Student)
const deleteJobApplication = async (req, res) => {
  try {
    const job = await JobApplication.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job application not found' });
    }

    // Verify ownership
    if (job.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this application' });
    }

    await job.deleteOne();
    return res.json({ success: true, message: 'Job application removed' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getJobApplications,
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
};
