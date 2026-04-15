/*
  middleware/authMiddleware.js
  ────────────────────────────
  Yeh middleware check karta hai ki user logged in hai ya nahi.

  Kaise kaam karta hai:
  1. Browser ke cookie se JWT token nikalo
  2. Token verify karo using JWT_SECRET
  3. Agar valid hai → req.user mein user info save karo → next()
  4. Agar invalid/missing → login page pe redirect karo

  Use karo: Protected routes pe (dashboard, transactions, budget, reports)
*/

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    // ── Step 1: Cookie se token nikalo
    const token = req.cookies.token;

    // Agar token nahi mila → login page pe bhejo
    if (!token) {
      return res.redirect('/auth/login');
    }

    // ── Step 2: Token verify karo
    // jwt.verify() token decode karta hai using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ── Step 3: Database se user dhundo
    // decoded.id = woh id jo humne token banate waqt daali thi
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.redirect('/auth/login');
    }

    // ── Step 4: User info ko request mein attach karo
    // Ab kisi bhi route mein req.user se user access kar sakte ho
    req.user = user;

    // ── Step 5: Aage badho (next route/controller)
    next();

  } catch (error) {
    // Token expire ho gaya ya invalid hai
    console.log('Auth Error:', error.message);
    res.redirect('/auth/login');
  }
};

module.exports = protect;
