import express from 'express';
import mongoose from 'mongoose';
import dns from 'dns';

// Ensure standard Google DNS for reliable SRV resolution on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const router = express.Router();

// ================= MONGODB DATABASE CONNECTION =================
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/waywise';
let isMongoConnected = false;

mongoose.connect(MONGODB_URI)
  .then(() => {
    isMongoConnected = true;
    console.log(' Connected to MongoDB Atlas Database: waywise');
  })
  .catch((err) => {
    isMongoConnected = false;
    console.warn(' MongoDB Atlas connection note:', err.message);
    console.warn(' Tip: Make sure 0.0.0.0/0 is added in MongoDB Atlas -> Network Access.');
  });

mongoose.connection.on('connected', () => { isMongoConnected = true; });
mongoose.connection.on('disconnected', () => { isMongoConnected = false; });

// Mongoose Schema & Model for WayWise Bookings
const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true },
  pickup: { type: String, required: true },
  destination: { type: String, required: true },
  vehicle: { type: String, default: 'Mini Cab' },
  fare: { type: Number, required: true },
  paymentMethod: { type: String, default: 'cash' },
  arrival: { type: String, default: '5 min' },
  status: { type: String, default: 'Confirmed' },
  submittedAt: { type: Date, default: Date.now }
});

export const BookingModel = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

// Helper to save to Mongo when a booking is created
export async function saveBookingToMongo(bookingData) {
  if (!isMongoConnected) return null;
  try {
    const doc = await BookingModel.create({
      bookingId: bookingData.id || `RW-${Date.now().toString().slice(-8)}`,
      pickup: bookingData.pickup,
      destination: bookingData.destination,
      vehicle: bookingData.vehicle || 'Mini Cab',
      fare: Number(bookingData.fare) || 599,
      paymentMethod: bookingData.paymentMethod || 'cash',
      arrival: bookingData.arrival || '5 min',
      status: bookingData.status || 'Confirmed'
    });
    console.log(`[MongoDB] Booking ${doc.bookingId} successfully saved to MongoDB Atlas!`);
    return doc;
  } catch (err) {
    console.warn('[MongoDB] Sync note:', err.message);
    return null;
  }
}

// ================= PARAMETER 4: MONGODB CRUD ROUTES =================

// 1. CREATE (POST) - Add new booking to MongoDB
router.post('/api/mongo/bookings', async (req, res) => {
  try {
    const { pickup, destination, vehicle, fare, paymentMethod, arrival } = req.body || {};
    if (!pickup?.trim() || !destination?.trim()) {
      return res.status(400).json({ error: 'Pickup and destination are required.' });
    }

    const newBooking = new BookingModel({
      bookingId: `RW-MG-${Date.now().toString().slice(-6)}`,
      pickup: pickup.trim(),
      destination: destination.trim(),
      vehicle: vehicle || 'Mini Cab',
      fare: Number(fare) || 599,
      paymentMethod: paymentMethod || 'cash',
      arrival: arrival || '5 min',
      status: 'Confirmed'
    });

    const saved = await newBooking.save();
    res.status(201).json({
      success: true,
      message: 'Booking created in MongoDB Atlas successfully.',
      booking: saved
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking in MongoDB: ' + err.message });
  }
});

// 2. READ (GET) - Fetch all bookings from MongoDB
router.get('/api/mongo/bookings', async (_req, res) => {
  try {
    const bookings = await BookingModel.find().sort({ submittedAt: -1 });
    res.json({
      success: true,
      database: 'MongoDB Atlas',
      count: bookings.length,
      bookings
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings from MongoDB: ' + err.message });
  }
});

// 3. READ SINGLE (GET :id)
router.get('/api/mongo/bookings/:id', async (req, res) => {
  try {
    const booking = await BookingModel.findOne({
      $or: [{ _id: mongoose.isValidObjectId(req.params.id) ? req.params.id : null }, { bookingId: req.params.id }]
    });
    if (!booking) return res.status(404).json({ error: 'Booking not found in MongoDB.' });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve booking: ' + err.message });
  }
});

// 4. UPDATE (PUT) - Update booking status / fare / vehicle in MongoDB
router.put('/api/mongo/bookings/:id', async (req, res) => {
  try {
    const { status, vehicle, fare, paymentMethod } = req.body || {};
    const query = mongoose.isValidObjectId(req.params.id) ? { _id: req.params.id } : { bookingId: req.params.id };

    const updateFields = {};
    if (status) updateFields.status = status;
    if (vehicle) updateFields.vehicle = vehicle;
    if (fare) updateFields.fare = Number(fare);
    if (paymentMethod) updateFields.paymentMethod = paymentMethod;

    const updated = await BookingModel.findOneAndUpdate(query, updateFields, { returnDocument: 'after' });
    if (!updated) return res.status(404).json({ error: 'Booking not found in MongoDB.' });

    res.json({
      success: true,
      message: `Booking ${updated.bookingId} updated in MongoDB successfully.`,
      booking: updated
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update booking in MongoDB: ' + err.message });
  }
});

// 5. DELETE (DELETE) - Remove booking from MongoDB
router.delete('/api/mongo/bookings/:id', async (req, res) => {
  try {
    const query = mongoose.isValidObjectId(req.params.id) ? { _id: req.params.id } : { bookingId: req.params.id };
    const deleted = await BookingModel.findOneAndDelete(query);
    if (!deleted) return res.status(404).json({ error: 'Booking not found in MongoDB.' });

    res.json({
      success: true,
      message: `Booking ${deleted.bookingId} deleted from MongoDB Atlas successfully.`,
      deletedBooking: deleted
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete booking from MongoDB: ' + err.message });
  }
});

// MongoDB Status endpoint
router.get('/api/mongo/status', async (_req, res) => {
  res.json({
    connected: isMongoConnected,
    database: mongoose.connection.name || 'waywise',
    readyState: mongoose.connection.readyState, // 1 = connected
    host: mongoose.connection.host || 'Atlas Cluster'
  });
});

export default router;
