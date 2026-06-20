const mongoose = require('mongoose');

const dsaProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    topicName: {
      type: String,
      required: [true, 'Please add a topic name'],
      trim: true,
    },
    totalQuestions: {
      type: Number,
      required: [true, 'Please specify total questions'],
      min: [1, 'Total questions must be at least 1'],
    },
    solvedQuestions: {
      type: Number,
      required: [true, 'Please specify solved questions'],
      min: [0, 'Solved questions cannot be negative'],
      validate: {
        validator: function (value) {
          return value <= this.totalQuestions;
        },
        message: 'Solved questions ({VALUE}) cannot exceed total questions',
      },
    },
    difficulty: {
      type: String,
      required: [true, 'Please specify difficulty level'],
      enum: ['Easy', 'Medium', 'Hard'],
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DsaProgress', dsaProgressSchema);
