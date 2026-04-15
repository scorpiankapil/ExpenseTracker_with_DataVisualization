/*
  models/Transaction.js
  ──────────────────────
  Transaction ka schema — har income/expense yahan save hoga.

  Fields:
  - user:     Kis user ka transaction hai (User se link)
  - title:    Transaction ka naam (e.g. "Grocery Shopping")
  - amount:   Kitne rupaye
  - type:     "income" ya "expense"
  - category: Food, Travel, Rent, etc.
  - date:     Transaction ki date
  - notes:    Optional extra detail
*/

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    // Har transaction ek specific user se linked hai
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',           // User model se reference
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
    },

    // Only "income" ya "expense" allowed hai
    type: {
      type:     String,
      required: true,
      enum:     ['income', 'expense'],
    },

    // Predefined categories
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
      default: Date.now,    // aaj ki date default
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
