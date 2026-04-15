const bcrypt = require('bcryptjs');
const User   = require('../models/User');

const getProfile = async (req, res) => {
  try {
    const Transaction = require('../models/Transaction');
    const Budget      = require('../models/Budget');

    const txCount     = await Transaction.countDocuments({ user: req.user._id });
    const budgetCount = await Budget.countDocuments({ user: req.user._id });
    const memberDays  = Math.max(1, Math.floor((Date.now() - new Date(req.user.createdAt)) / (1000 * 60 * 60 * 24)));

    res.render('profile', {
      title:       'Profile — ExpenseIQ',
      user:        req.user,
      txCount,
      budgetCount,
      memberDays,
      success:     req.query.success || null,
      error:       req.query.error   || null,
    });
  } catch (error) {
    console.error('Profile Error:', error);
    res.redirect('/dashboard');
  }
};

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const name = `${firstName} ${lastName || ''}`.trim();

    const existing = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (existing) {
      return res.redirect('/profile?error=Email already in use by another account');
    }

    await User.findByIdAndUpdate(req.user._id, { name, email });
    res.redirect('/profile?success=Profile updated successfully');
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.redirect('/profile?error=Could not update profile');
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.redirect('/profile?error=New passwords do not match');
    }

    if (newPassword.length < 8) {
      return res.redirect('/profile?error=Password must be at least 8 characters');
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.redirect('/profile?error=Current password is incorrect');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.user._id, { password: hashed });

    res.redirect('/profile?success=Password changed successfully');
  } catch (error) {
    console.error('Change Password Error:', error);
    res.redirect('/profile?error=Could not change password');
  }
};

const updateIncome = async (req, res) => {
  try {
    const income = parseFloat(req.body.monthlyIncome);
    if (isNaN(income) || income < 0 || income > 500000) {
      return res.redirect('/profile?error=Monthly income must be between 0 and 500000');
    }
    await User.findByIdAndUpdate(req.user._id, { monthlyIncome: income });
    res.redirect('/profile?success=Monthly income updated');
  } catch (error) {
    console.error('Update Income Error:', error);
    res.redirect('/profile?error=Could not update income');
  }
};

const getSettings = async (req, res) => {
  res.render('settings', {
    title: 'Settings — ExpenseIQ',
    user:  req.user,
  });
};

const deleteAccount = async (req, res) => {
  try {
    const Transaction = require('../models/Transaction');
    const Budget      = require('../models/Budget');

    await Transaction.deleteMany({ user: req.user._id });
    await Budget.deleteMany({ user: req.user._id });
    await User.findByIdAndDelete(req.user._id);

    res.cookie('token', '', { maxAge: 0 });
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Delete Account Error:', error);
    res.redirect('/settings?error=Could not delete account');
  }
};

module.exports = { getProfile, updateProfile, changePassword, updateIncome, getSettings, deleteAccount };
