/*
  controllers/authController.js
  ──────────────────────────────
  Authentication ka saara logic yahan hai.

  Functions:
  1. showLogin    → Login page dikhao
  2. loginUser    → Form submit pe login karo
  3. showRegister → Register page dikhao
  4. registerUser → Form submit pe account banao
  5. logoutUser   → Cookie delete karo aur logout karo
*/

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');


/* ────────────────────────────────────────────────
   HELPER: JWT Token banao aur cookie mein save karo
   
   jwt.sign() → token banata hai
   res.cookie() → browser ke cookie mein save karta hai
──────────────────────────────────────────────── */
const createTokenAndSendCookie = (res, userId) => {
  // Token banao: user id andar daalo, secret key se sign karo
  const token = jwt.sign(
    { id: userId },           // payload (data inside token)
    process.env.JWT_SECRET,   // secret key from .env
    { expiresIn: process.env.JWT_EXPIRE || '7d' }  // token 7 din baad expire
  );

  // Cookie mein token save karo
  res.cookie('token', token, {
    httpOnly: true,      // JavaScript se access nahi hoga (security)
    maxAge:   7 * 24 * 60 * 60 * 1000,   // 7 din (milliseconds mein)
    sameSite: 'strict',  // CSRF attacks se bachao
  });
};


/* ────────────────────────────────────────────────
   1. GET /auth/login → Login page dikhao
──────────────────────────────────────────────── */
const showLogin = (req, res) => {
  res.render('login', {
    title:   'Login — ExpenseIQ',
    error:   null,
    success: null,
  });
};


/* ────────────────────────────────────────────────
   2. POST /auth/login → Login process karo

   Steps:
   a) Form se email + password lo
   b) Database mein email dhundo
   c) Password match karo (bcrypt.compare)
   d) Token banao, cookie mein save karo
   e) Dashboard pe redirect karo
──────────────────────────────────────────────── */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ── Validation: fields empty nahi hone chahiye
    if (!email || !password) {
      return res.render('login', {
        title:   'Login — ExpenseIQ',
        error:   'Please fill in all fields',
        success: null,
      });
    }

    // ── Database mein user dhundo (password bhi select karo)
    // "+password" → kyunki humne schema mein select:false kiya tha
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.render('login', {
        title:   'Login — ExpenseIQ',
        error:   'Invalid email or password',
        success: null,
      });
    }

    // ── Password compare karo (plain vs hashed)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render('login', {
        title:   'Login — ExpenseIQ',
        error:   'Invalid email or password',
        success: null,
      });
    }

    // ── Token banao aur cookie mein save karo
    createTokenAndSendCookie(res, user._id);

    // ── Dashboard pe redirect karo
    res.redirect('/dashboard');

  } catch (error) {
    console.error('Login Error:', error);
    res.render('login', {
      title:   'Login — ExpenseIQ',
      error:   'Something went wrong. Please try again.',
      success: null,
    });
  }
};


/* ────────────────────────────────────────────────
   3. GET /auth/register → Register page dikhao
──────────────────────────────────────────────── */
const showRegister = (req, res) => {
  res.render('register', {
    title: 'Register — ExpenseIQ',
    error: null,
  });
};


/* ────────────────────────────────────────────────
   4. POST /auth/register → Account banao

   Steps:
   a) Form se data lo
   b) Check karo email already exist toh nahi karta
   c) Password ko bcrypt se hash karo
   d) New user database mein save karo
   e) Login page pe redirect karo with success message
──────────────────────────────────────────────── */
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, monthlyIncome } = req.body;

    // ── Validation: saare fields check karo
    if (!firstName || !lastName || !email || !password) {
      return res.render('register', {
        title: 'Register — ExpenseIQ',
        error: 'Please fill in all required fields',
      });
    }

    // ── Password match check
    if (password !== confirmPassword) {
      return res.render('register', {
        title: 'Register — ExpenseIQ',
        error: 'Passwords do not match',
      });
    }

    // ── Password length check
    if (password.length < 8) {
      return res.render('register', {
        title: 'Register — ExpenseIQ',
        error: 'Password must be at least 8 characters',
      });
    }

    // ── Check: kya email already registered hai?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('register', {
        title: 'Register — ExpenseIQ',
        error: 'Email is already registered. Please login.',
      });
    }

    // ── Password hash karo using bcrypt
    // saltRounds = 10 → jitna zyada, utna secure (but slow)
    const saltRounds   = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // ── New user banao aur save karo
    const newUser = await User.create({
      name:          `${firstName} ${lastName}`,
      email:         email,
      password:      hashedPassword,
      monthlyIncome: monthlyIncome || 0,
    });

    // ── Login page pe redirect karo with success message
    res.redirect('/auth/login?registered=true');

  } catch (error) {
    console.error('Register Error:', error);
    res.render('register', {
      title: 'Register — ExpenseIQ',
      error: 'Something went wrong. Please try again.',
    });
  }
};


/* ────────────────────────────────────────────────
   5. GET /auth/logout → Logout karo

   Cookie delete karo → login page pe redirect
──────────────────────────────────────────────── */
const logoutUser = (req, res) => {
  // Cookie clear karo (maxAge: 0 se immediately expire)
  res.cookie('token', '', { maxAge: 0 });
  res.redirect('/auth/login');
};


// ── Saare functions export karo
module.exports = {
  showLogin,
  loginUser,
  showRegister,
  registerUser,
  logoutUser,
};
