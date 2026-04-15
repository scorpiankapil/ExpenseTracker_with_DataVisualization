const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },

    category: {
      type:     String,
      required: true,
      enum: [
        'Food', 'Travel', 'Health', 'Shopping',
        'Rent', 'Entertainment', 'Education', 'Utilities', 'Other',
      ],
    },

    limit: {
      type:     Number,
      required: [true, 'Budget limit is required'],
      min:      [1, 'Limit must be at least 1'],
    },

    month: {
      type:     String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

budgetSchema.index({ user: 1, category: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
