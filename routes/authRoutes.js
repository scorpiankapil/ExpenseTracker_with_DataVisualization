/*
  routes/authRoutes.js
  ──────────────────────
  Authentication ke saare routes yahan define hain.

  Routes:
  GET  /auth/login     → Login page dikhao
  POST /auth/login     → Login form submit
  GET  /auth/register  → Register page dikhao
  POST /auth/register  → Register form submit
  GET  /auth/logout    → Logout karo
*/

const express        = require('express');
const router         = express.Router();
const authController = require('../controllers/authController');


// ── Login page dikhao
router.get('/login', authController.showLogin);

// ── Login form submit (POST request from form)
router.post('/login', authController.loginUser);

// ── Register page dikhao
router.get('/register', authController.showRegister);

// ── Register form submit
router.post('/register', authController.registerUser);

// ── Logout
router.get('/logout', authController.logoutUser);


module.exports = router;
