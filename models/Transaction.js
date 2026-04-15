const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },

    title: {
      type:     String,
      required: [true, 'Title is required'],
      trim:     true,
      maxlength: 100,
    },

    amount: {
      type:     Number,
      required: [true, 'Amount is required'],
      min:      [1, 'Amount must be at least 1'],
      max:      [500000, 'Amount cannot exceed 500000'],
    },

    type: {
      type:     String,
      required: true,
      enum:     ['income', 'expense'],
    },

    category: {
      type: String,
      required: true,
      enum: [
        'Food', 'Travel', 'Health', 'Shopping',
        'Rent', 'Entertainment', 'Education',
        'Utilities', 'Salary', 'Freelance',
        'Investment', 'Gift', 'Other',
      ],
    },

    date: {
      type:    Date,
      default: Date.now,
      validate: {
        validator: function(v) {
          if (!v) return true; // Handled by default
          const txDateOnly = new Date(v);
          txDateOnly.setHours(0, 0, 0, 0);

          const todayOnly = new Date();
          todayOnly.setHours(0, 0, 0, 0);

          const minDate = new Date(todayOnly);
          minDate.setDate(todayOnly.getDate() - 3);

          const maxDate = new Date(todayOnly);
          maxDate.setDate(todayOnly.getDate() + 1);

          return txDateOnly >= minDate && txDateOnly <= maxDate;
        },
        message: 'Date must be within the past 3 days and next 1 day'
      }
    },

    notes: {
      type:    String,
      trim:    true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
