const express          = require('express');
const router           = express.Router();
const protect          = require('../middleware/authMiddleware');
const budgetController = require('../controllers/budgetController');


router.get('/', protect, budgetController.getBudget);

router.post('/set', protect, budgetController.setBudget);

router.delete('/delete/:id', protect, budgetController.deleteBudget);

module.exports = router;
