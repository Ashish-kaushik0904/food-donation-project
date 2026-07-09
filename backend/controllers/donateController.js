const DonateRequest = require('../models/DonateRequest');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// CREATE a new donate request
exports.createDonateRequest = async (req, res) => {
  try {
    const { foodType, quantity, address, availableTill } = req.body;

    const newRequest = new DonateRequest({
      donorId: req.user.id,
      foodType,
      quantity,
      address,
      availableTill
    });

    await newRequest.save();
    res.status(201).json({ message: 'Donate request created successfully', data: newRequest });

    // Notify all admins (fire and forget, doesn't block the response)
    const admins = await User.find({ role: 'admin' });
    admins.forEach((admin) => {
      sendEmail(
        admin.email,
        'New food donation posted',
        `A new donation has been posted.\n\nFood: ${foodType}\nQuantity: ${quantity}\nAddress: ${address}\nAvailable until: ${availableTill}\n\nLog in to the admin dashboard to review it.`
      );
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET all donate requests of logged-in donor
exports.getMyDonateRequests = async (req, res) => {
  try {
    const requests = await DonateRequest.find({ donorId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE a donate request (only if it belongs to the user and is still pending)
exports.updateDonateRequest = async (req, res) => {
  try {
    const request = await DonateRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Donation not found' });

    if (request.donorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own donations' });
    }
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending donations can be edited' });
    }

    const { foodType, quantity, address, availableTill } = req.body;
    request.foodType = foodType;
    request.quantity = quantity;
    request.address = address;
    request.availableTill = availableTill;
    await request.save();

    res.status(200).json({ message: 'Donation updated successfully', data: request });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE a donate request (only if it belongs to the user and is still pending)
exports.deleteDonateRequest = async (req, res) => {
  try {
    const request = await DonateRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Donation not found' });

    if (request.donorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own donations' });
    }
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending donations can be deleted' });
    }

    await request.deleteOne();
    res.status(200).json({ message: 'Donation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};