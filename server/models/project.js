var mongoose = require('mongoose');

var Project = mongoose.model('Project', {
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false,
    required: true
  },
  skillsRequired: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

module.exports = {Project};
