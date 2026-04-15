const express           = require('express');
const router            = express.Router();
const protect           = require('../middleware/authMiddleware');
const profileController = require('../controllers/profileController');

router.get('/',                protect, profileController.getProfile);
router.post('/update',         protect, profileController.updateProfile);
router.post('/change-password',protect, profileController.changePassword);
router.post('/update-income',  protect, profileController.updateIncome);
router.get('/delete',          protect, profileController.deleteAccount);

module.exports = router;
