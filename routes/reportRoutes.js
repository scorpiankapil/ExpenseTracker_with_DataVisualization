const express          = require('express');
const router           = express.Router();
const protect          = require('../middleware/authMiddleware');
const reportController = require('../controllers/reportController');

router.get('/', protect, reportController.getReports);

router.get('/export', protect, (req, res) => {
  if (req.query.format === 'pdf') {
    reportController.exportPDF(req, res);
  } else {
    reportController.exportCSV(req, res);
  }
});

module.exports = router;