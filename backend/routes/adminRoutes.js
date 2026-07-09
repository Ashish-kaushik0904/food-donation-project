const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const {
  getAllDonateRequests,
  getAllNeedRequests,
  acceptDonateRequest,
  rejectDonateRequest,
  acceptNeedRequest,
  rejectNeedRequest,
  getDashboardStats
} = require('../controllers/adminController');

router.get('/donate-requests', protect, isAdmin, getAllDonateRequests);
router.get('/need-requests', protect, isAdmin, getAllNeedRequests);

router.post('/donate/:id/accept', protect, isAdmin, acceptDonateRequest);
router.post('/donate/:id/reject', protect, isAdmin, rejectDonateRequest);

router.post('/need/:id/accept', protect, isAdmin, acceptNeedRequest);
router.post('/need/:id/reject', protect, isAdmin, rejectNeedRequest);

router.get('/dashboard-stats', protect, isAdmin, getDashboardStats);

module.exports = router;