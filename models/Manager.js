const mongoose = require('mongoose');

const ManagerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  userId:{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  email:{
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  modefiedAt:{
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Manager', ManagerSchema);
