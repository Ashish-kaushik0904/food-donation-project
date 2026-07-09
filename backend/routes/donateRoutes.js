const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createDonateRequest,
  getMyDonateRequests,
  updateDonateRequest,
  deleteDonateRequest
} = require('../controllers/donateController');

router.post('/', protect, createDonateRequest);
router.get('/my', protect, getMyDonateRequests);
router.put('/:id', protect, updateDonateRequest);
router.delete('/:id', protect, deleteDonateRequest);

module.exports = router;