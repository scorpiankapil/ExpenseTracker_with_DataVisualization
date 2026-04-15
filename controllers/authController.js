const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');

const createTokenAndSendCookie = (res, userId) => {
  const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    maxAge:   7 * 24 * 60 * 60 * 1000,
    sameSite: 'strict',
  });
};


const showLogin = (req, res) => {
  res.render('login', {
    title:   'Login — ExpenseIQ',
    error:   null,
    success: null,
  });
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const trimmedEmail = email ? email.trim() : '';

    if (!trimmedEmail || !password) {
      return res.render('login', {
        title:   'Login — ExpenseIQ',
        error:   'Please fill in all fields',
        success: null,
      });
    }

    const user = await User.findOne({ email: trimmedEmail }).select('+password');

    if (!user) {
      return res.render('login', {
        title:   'Login — ExpenseIQ',
        error:   'Invalid email or password',
        success: null,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render('login', {
        title:   'Login — ExpenseIQ',
        error:   'Invalid email or password',
        success: null,
      });
    }

    createTokenAndSendCookie(res, user._id);

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


const showRegister = (req, res) => {
  res.render('register', {
    title: 'Register — ExpenseIQ',
    error: null,
  });
};


const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, monthlyIncome } = req.body;

    const trimmedFirstName = firstName ? firstName.trim() : '';
    const trimmedLastName  = lastName ? lastName.trim() : '';
    const trimmedEmail     = email ? email.trim() : '';

    if (!trimmedFirstName || !trimmedLastName || !trimmedEmail || !password) {
      return res.render('register', {
        title: 'Register — ExpenseIQ',
        error: 'Please fill in all required fields',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.render('register', {
        title: 'Register — ExpenseIQ',
        error: 'Please provide a valid email format',
      });
    }

    if (password !== confirmPassword) {
      return res.render('register', {
        title: 'Register — ExpenseIQ',
        error: 'Passwords do not match',
      });
    }

    if (password.length < 8 || password.length > 20) {
      return res.render('register', {
        title: 'Register — ExpenseIQ',
        error: 'Password must be between 8 to 20 characters',
      });
    }

    if (trimmedEmail.length < 10 || trimmedEmail.length > 50) {
      return res.render('register', {
        title: 'Register — ExpenseIQ',
        error: 'Email must be between 10 to 50 characters',
      });
    }

    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.render('register', {
        title: 'Register — ExpenseIQ',
        error: 'Email is already registered. Please login.',
      });
    }

    if (monthlyIncome && (isNaN(parseFloat(monthlyIncome)) || parseFloat(monthlyIncome) < 0 || parseFloat(monthlyIncome) > 500000)) {
      return res.render('register', {
        title: 'Register — ExpenseIQ',
        error: 'Monthly income must be between 0 and 500000',
      });
    }

    const saltRounds   = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      name:          `${trimmedFirstName} ${trimmedLastName}`,
      email:         trimmedEmail,
      password:      hashedPassword,
      monthlyIncome: monthlyIncome ? parseFloat(monthlyIncome) : 0,
    });

    res.redirect('/auth/login?registered=true');

  } catch (error) {
    console.error('Register Error:', error);
    res.render('register', {
      title: 'Register — ExpenseIQ',
      error: 'Something went wrong. Please try again.',
    });
  }
};


const logoutUser = (req, res) => {
  res.cookie('token', '', { maxAge: 0 });
  res.redirect('/auth/login');
};


module.exports = {
  showLogin,
  loginUser,
  showRegister,
  registerUser,
  logoutUser,
};
