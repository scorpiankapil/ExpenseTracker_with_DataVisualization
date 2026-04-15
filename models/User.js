/*
  models/User.js
  ──────────────
  User ka schema (blueprint) define karta hai.
  Matlab MongoDB mein User ka data kaisa store hoga.

  Fields:
  - name:          User ka naam
  - email:         Unique email (login ke liye)
  - password:      bcrypt se hashed password
  - monthlyIncome: Optional - user ki monthly salary
  - createdAt:     Automatically set hota hai
*/

const mongoose = require('mongoose');

// ── User Schema define karo ──────────────────────
const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,       // extra spaces remove karta hai
      maxlength: 50,
    },

    email: {
      type:     String,
      required: [true, 'Email is required'],
      unique:   true,       // same email se 2 users nahi ban sakte
      lowercase: true,      // always lowercase save hoga
      trim:     true,
    },

    password: {
      type:      String,
      required:  [true, 'Password is required'],
      minlength: 8,
      select:    false,     // by default password query mein nahi aayega
    },

    monthlyIncome: {
      type:    Number,
      default: 0,
    },
  },
  {
    timestamps: true,   // createdAt aur updatedAt auto add hoga
  }
);

// ── Model banao aur export karo ──────────────────
module.exports = mongoose.model('User', userSchema);
