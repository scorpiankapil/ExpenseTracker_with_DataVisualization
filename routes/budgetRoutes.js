/*
  routes/budgetRoutes.js
  ───────────────────────
  Budget ke saare routes.

  Routes:
  GET    /budget            → Budget page
  POST   /budget/set        → Budget set/update karo
  DELETE /budget/delete/:id → Budget delete karo
*/

const express          = require('express');
const router           = express.Router();
const protect          = require('../middleware/authMiddleware');
const budgetController = require('../controllers/budgetController');


// Budget page
router.get('/', protect, budgetController.getBudget);

// Set budget (create ya update)
router.post('/set', protect, budgetController.setBudget);

// Delete budget
router.delete('/delete/:id', protect, budgetController.deleteBudget);


module.exports = router;
