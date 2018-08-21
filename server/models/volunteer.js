var mongoose = require('mongoose');

var Volunteer = mongoose.model('Volunteer', {
  firstName: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  age: {
    type: String
  },
  gender: {
    type: String
  },
  email: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  missionGroup: {
    type: String,
    trim: true,
    default: " "
  },
  skills: {
    type: String,
    trim: true
  },
  medicalConditions: {
    type: String,
    trim: true
  },
  housingAssignment: {
    type: String,
    default: '',
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
});

module.exports = {Volunteer};
