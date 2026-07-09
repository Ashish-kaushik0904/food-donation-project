const DonateRequest = require('../models/DonateRequest');
const NeedRequest = require('../models/NeedRequest');
const sendEmail = require('../utils/sendEmail');

// GET all donate requests (all statuses, newest first)
exports.getAllDonateRequests = async (req, res) => {
  try {
    const requests = await DonateRequest.find()
      .populate('donorId', 'name phone email')
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET all need requests (all statuses, newest first)
exports.getAllNeedRequests = async (req, res) => {
  try {
    const requests = await NeedRequest.find()
      .populate('receiverId', 'name phone email')
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ACCEPT a donate request
exports.acceptDonateRequest = async (req, res) => {
  try {
    const { message } = req.body;
    const request = await DonateRequest.findById(req.params.id).populate('donorId', 'name email');
    if (!request) return res.status(404).json({ message: 'Donation not found' });

    request.status = 'accepted';
    if (message) request.adminMessage = message;
    await request.save();

    res.status(200).json({ message: 'Donation accepted', data: request });

    sendEmail(
      request.donorId.email,
      'Your food donation was accepted',
      `Hi ${request.donorId.name},\n\nYour donation of "${request.foodType}" has been accepted.${message ? `\n\nAdmin note: ${message}` : ''}\n\nThank you for your contribution.`
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// REJECT a donate request
exports.rejectDonateRequest = async (req, res) => {
  try {
    const { message } = req.body;
    const request = await DonateRequest.findById(req.params.id).populate('donorId', 'name email');
    if (!request) return res.status(404).json({ message: 'Donation not found' });

    request.status = 'rejected';
    if (message) request.adminMessage = message;
    await request.save();

    res.status(200).json({ message: 'Donation rejected', data: request });

    sendEmail(
      request.donorId.email,
      'Update on your food donation',
      `Hi ${request.donorId.name},\n\nYour donation of "${request.foodType}" was not accepted at this time.${message ? `\n\nAdmin note: ${message}` : ''}`
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ACCEPT a need request (with optional message, e.g. "only 2kg available")
exports.acceptNeedRequest = async (req, res) => {
  try {
    const { message } = req.body;
    const request = await NeedRequest.findById(req.params.id).populate('receiverId', 'name email');
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'accepted';
    if (message) request.adminMessage = message;
    await request.save();

    res.status(200).json({ message: 'Request accepted', data: request });

    sendEmail(
      request.receiverId.email,
      'Your food request was accepted',
      `Hi ${request.receiverId.name},\n\nYour request for "${request.foodNeeded}" has been accepted.${message ? `\n\nAdmin note: ${message}` : ''}\n\nLog in to the app for more details.`
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// REJECT a need request
exports.rejectNeedRequest = async (req, res) => {
  try {
    const { message } = req.body;
    const request = await NeedRequest.findById(req.params.id).populate('receiverId', 'name email');
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'rejected';
    if (message) request.adminMessage = message;
    await request.save();

    res.status(200).json({ message: 'Request rejected', data: request });

    sendEmail(
      request.receiverId.email,
      'Update on your food request',
      `Hi ${request.receiverId.name},\n\nYour request for "${request.foodNeeded}" could not be fulfilled at this time.${message ? `\n\nAdmin note: ${message}` : ''}`
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalDonations = await DonateRequest.countDocuments();
    const totalNeeds = await NeedRequest.countDocuments();
    const pendingDonations = await DonateRequest.countDocuments({ status: 'pending' });
    const pendingNeeds = await NeedRequest.countDocuments({ status: 'pending' });
    const acceptedDonations = await DonateRequest.countDocuments({ status: 'accepted' });
    const acceptedNeeds = await NeedRequest.countDocuments({ status: 'accepted' });

    res.status(200).json({
      totalDonations,
      totalNeeds,
      pendingDonations,
      pendingNeeds,
      acceptedDonations,
      acceptedNeeds
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};