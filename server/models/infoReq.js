var mongoose = require('mongoose');

var InfoReq = mongoose.model('InfoReq', {
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
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  groupName: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

module.exports = {InfoReq};
