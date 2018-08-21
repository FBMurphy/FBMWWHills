var mongoose = require('mongoose');

var MissionGroup = mongoose.model('MissionGroup', {
  leaderFirst: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  leaderLast: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  leaderEmail: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  leaderPhone: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  groupName: {
    type: String,
    required: true,
    minlength: 1,
    unique: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  numMales: {
    type: Number,
    required: true
  },
  numFemales: {
    type: Number,
    required: true
  }
});

module.exports = {MissionGroup};
