const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createNeedRequest,
  getMyNeedRequests,
  updateNeedRequest,
  deleteNeedRequest
} = require('../controllers/needController');

router.post('/', protect, createNeedRequest);
router.get('/my', protect, getMyNeedRequests);
router.put('/:id', protect, updateNeedRequest);
router.delete('/:id', protect, deleteNeedRequest);

module.exports = router;