var mongoose = require('mongoose');

var HousingUnit = mongoose.model('HousingUnit', {
  unitName: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  occupants: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

module.exports = {HousingUnit};
