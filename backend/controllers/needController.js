const NeedRequest = require('../models/NeedRequest');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// CREATE a new need request
exports.createNeedRequest = async (req, res) => {
  try {
    const { foodNeeded, quantityNeeded, address, urgency } = req.body;

    const newRequest = new NeedRequest({
      receiverId: req.user.id,
      foodNeeded,
      quantityNeeded,
      address,
      urgency
    });

    await newRequest.save();
    res.status(201).json({ message: 'Need request created successfully', data: newRequest });

    // Notify all admins
    const admins = await User.find({ role: 'admin' });
    admins.forEach((admin) => {
      sendEmail(
        admin.email,
        'New food request posted',
        `A new food request has been posted.\n\nFood needed: ${foodNeeded}\nQuantity: ${quantityNeeded}\nAddress: ${address}\nUrgency: ${urgency}\n\nLog in to the admin dashboard to review it.`
      );
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET all need requests of logged-in receiver
exports.getMyNeedRequests = async (req, res) => {
  try {
    const requests = await NeedRequest.find({ receiverId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE a need request (only if it belongs to the user and is still pending)
exports.updateNeedRequest = async (req, res) => {
  try {
    const request = await NeedRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.receiverId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own requests' });
    }
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending requests can be edited' });
    }

    const { foodNeeded, quantityNeeded, address, urgency } = req.body;
    request.foodNeeded = foodNeeded;
    request.quantityNeeded = quantityNeeded;
    request.address = address;
    request.urgency = urgency;
    await request.save();

    res.status(200).json({ message: 'Request updated successfully', data: request });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE a need request (only if it belongs to the user and is still pending)
exports.deleteNeedRequest = async (req, res) => {
  try {
    const request = await NeedRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.receiverId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own requests' });
    }
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending requests can be deleted' });
    }

    await request.deleteOne();
    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};