const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.redirect('/auth/login');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.redirect('/auth/login');
    }

    req.user = user;

    next();

  } catch (error) {
    console.log('Auth Error:', error.message);
    res.redirect('/auth/login');
  }
};

module.exports = protect;
