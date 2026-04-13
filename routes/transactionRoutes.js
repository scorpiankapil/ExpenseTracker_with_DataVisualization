/*
  routes/transactionRoutes.js
  ─────────────────────────────
  Transaction ke saare routes.

  Note: Yahan "protect" middleware use kiya hai
  → Matlab sirf logged-in user yeh routes access kar sakta hai

  Routes:
  GET    /transactions          → All transactions page
  POST   /transactions/add      → Naya transaction add karo
  POST   /transactions/edit/:id → Transaction update karo
  DELETE /transactions/delete/:id → Transaction delete karo (AJAX)
*/

const express               = require('express');
const router                = express.Router();
const protect               = require('../middleware/authMiddleware');
const transactionController = require('../controllers/transactionController');


// ── Saare routes pe "protect" middleware lagao
// Matlab: pehle check karo ki user logged in hai ya nahi

// All transactions page
router.get('/', protect, transactionController.getTransactions);

// Add transaction (form submit)
router.post('/add', protect, transactionController.addTransaction);

// Edit transaction (form submit)
router.post('/edit/:id', protect, transactionController.editTransaction);

// Delete transaction (AJAX call se — JSON response)
router.delete('/delete/:id', protect, transactionController.deleteTransaction);


module.exports = router;
