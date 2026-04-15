const express               = require('express');
const router                = express.Router();
const protect               = require('../middleware/authMiddleware');
const transactionController = require('../controllers/transactionController');

router.get('/', protect, transactionController.getTransactions);
router.post('/add', protect, transactionController.addTransaction);
router.post('/edit/:id', protect, transactionController.editTransaction);
router.delete('/delete/:id', protect, transactionController.deleteTransaction);

module.exports = router;
