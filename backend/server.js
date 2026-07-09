const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.FRONTEND_URL
  ],
  credentials: true
}));
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Food Donation API is running...');
});

// Auth Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/donate', require('./routes/donateRoutes'));
app.use('/api/need', require('./routes/needRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.log('MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});