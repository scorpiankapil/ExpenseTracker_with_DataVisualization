const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
      maxlength: 50,
    },

    email: {
      type:     String,
      required: [true, 'Email is required'],
      unique:   true,
      lowercase: true,
      trim:     true,
      minlength: [10, 'Email must be at least 10 characters long'],
      maxlength: [50, 'Email cannot exceed 50 characters'],
      match:    [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },

    password: {
      type:      String,
      required:  [true, 'Password is required'],
      select:    false,
    },

    monthlyIncome: {
      type:    Number,
      default: 0,
      min:     [0, 'Monthly income cannot be negative'],
      max:     [500000, 'Monthly income cannot exceed 500000'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
