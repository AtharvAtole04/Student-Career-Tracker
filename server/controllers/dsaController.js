const DsaProgress = require('../models/DsaProgress');

// @desc    Get all DSA records for current user
// @route   GET /api/dsa
// @access  Private (Student)
const getDsaProgress = async (req, res) => {
  try {
    const dsaRecords = await DsaProgress.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json({ success: true, count: dsaRecords.length, data: dsaRecords });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new DSA progress log
// @route   POST /api/dsa
// @access  Private (Student)
const createDsaProgress = async (req, res) => {
  try {
    const { topicName, totalQuestions, solvedQuestions, difficulty, notes } = req.body;

    if (!topicName || totalQuestions === undefined || solvedQuestions === undefined || !difficulty) {
      return res.status(400).json({ success: false, message: 'Please add all required fields' });
    }

    const dsaRecord = await DsaProgress.create({
      userId: req.user.id,
      topicName,
      totalQuestions,
      solvedQuestions,
      difficulty,
      notes,
    });

    return res.status(201).json({ success: true, data: dsaRecord });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a DSA progress log
// @route   PUT /api/dsa/:id
// @access  Private (Student)
const updateDsaProgress = async (req, res) => {
  try {
    const { topicName, totalQuestions, solvedQuestions, difficulty, notes } = req.body;

    let dsaRecord = await DsaProgress.findById(req.params.id);

    if (!dsaRecord) {
      return res.status(404).json({ success: false, message: 'DSA progress record not found' });
    }

    // Verify ownership
    if (dsaRecord.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this record' });
    }

    // Set fields
    dsaRecord.topicName = topicName || dsaRecord.topicName;
    dsaRecord.totalQuestions = totalQuestions !== undefined ? totalQuestions : dsaRecord.totalQuestions;
    dsaRecord.solvedQuestions = solvedQuestions !== undefined ? solvedQuestions : dsaRecord.solvedQuestions;
    dsaRecord.difficulty = difficulty || dsaRecord.difficulty;
    dsaRecord.notes = notes !== undefined ? notes : dsaRecord.notes;

    const updatedRecord = await dsaRecord.save();
    return res.json({ success: true, data: updatedRecord });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a DSA progress log
// @route   DELETE /api/dsa/:id
// @access  Private (Student)
const deleteDsaProgress = async (req, res) => {
  try {
    const dsaRecord = await DsaProgress.findById(req.params.id);

    if (!dsaRecord) {
      return res.status(404).json({ success: false, message: 'DSA progress record not found' });
    }

    // Verify ownership
    if (dsaRecord.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this record' });
    }

    await dsaRecord.deleteOne();
    return res.json({ success: true, message: 'DSA progress record removed' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDsaProgress,
  createDsaProgress,
  updateDsaProgress,
  deleteDsaProgress,
};
