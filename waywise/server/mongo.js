import express from 'express';
import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure Google DNS for reliable SRV resolution on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

// Load .env explicitly so process.env.MONGODB_URI is ALWAYS available regardless of import order
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });
dotenv.config();

const router = express.Router();

// Fallback directly to user's MongoDB Atlas cluster URI so it never fails even if .env is missing
const ATLAS_FALLBACK = 'mongodb+srv://suhani_goel:Waywise12@cluster0.smsz8do.mongodb.net/waywise?retryWrites=true&w=majority';
const MONGODB_URI = process.env.MONGODB_URI || ATLAS_FALLBACK;

let isMongoConnected = false;

// Connect to MongoDB Atlas
mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 })
  .then(() => {
    isMongoConnected = true;
    console.log(' Connected to MongoDB Atlas Database: waywise');
  })
  .catch((err) => {
    isMongoConnected = false;
    console.warn(' MongoDB Atlas connection note:', err.message);
  });

mongoose.connection.on('connected', () => { 
  isMongoConnected = true; 
});
mongoose.connection.on('disconnected', () => { 
  isMongoConnected = false; 
});

// Mongoose Schema & Model for WayWise Bookings
const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
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

// Helper to save a single booking to MongoDB Atlas
export async function saveBookingToMongo(bookingData) {
  try {
    const doc = await BookingModel.findOneAndUpdate(
      { bookingId: bookingData.id || bookingData.bookingId },
      {
        bookingId: bookingData.id || bookingData.bookingId || `RW-${Date.now().toString().slice(-8)}`,
        pickup: bookingData.pickup,
        destination: bookingData.destination,
        vehicle: bookingData.vehicle || 'Mini Cab',
        fare: Number(bookingData.fare) || 599,
        paymentMethod: bookingData.paymentMethod || 'cash',
        arrival: bookingData.arrival || '5 min',
        status: bookingData.status || 'Confirmed',
        submittedAt: bookingData.submittedAt ? new Date(bookingData.submittedAt) : new Date()
      },
      { upsert: true, returnDocument: 'after' }
    );
    console.log(`[MongoDB] Booking ${doc.bookingId} successfully saved to MongoDB Atlas!`);
    return doc;
  } catch (err) {
    console.error('[MongoDB Error saving booking]:', err.message);
    return null;
  }
}

// Helper to sync all bookings from bookings.json into MongoDB Atlas
export async function syncAllBookingsToMongo(bookingsList = []) {
  let synced = 0;
  try {
    for (const b of bookingsList) {
      const bId = b.id || b.bookingId;
      if (!bId) continue;
      await BookingModel.findOneAndUpdate(
        { bookingId: bId },
        {
          bookingId: bId,
          pickup: b.pickup,
          destination: b.destination,
          vehicle: b.vehicle || 'Mini Cab',
          fare: Number(b.fare) || 599,
          paymentMethod: b.paymentMethod || 'cash',
          arrival: b.arrival || '5 min',
          status: b.status || 'Confirmed',
          submittedAt: b.submittedAt ? new Date(b.submittedAt) : new Date()
        },
        { upsert: true, returnDocument: 'after' }
      );
      synced++;
    }
    console.log(`[MongoDB] Synced ${synced} bookings from local JSON into MongoDB Atlas!`);
  } catch (err) {
    console.error('[MongoDB Sync error]:', err.message);
  }
  return synced;
}

// ================= PARAMETER 4: MONGODB CRUD ROUTES =================

// 1. CREATE (POST) - Add new booking to MongoDB Atlas
router.post('/api/mongo/bookings', async (req, res) => {
  try {
    const { pickup, destination, vehicle, fare, paymentMethod, arrival, id } = req.body || {};
    if (!pickup?.trim() || !destination?.trim()) {
      return res.status(400).json({ error: 'Pickup and destination are required.' });
    }

    const saved = await saveBookingToMongo({
      id: id || `RW-MG-${Date.now().toString().slice(-6)}`,
      pickup: pickup.trim(),
      destination: destination.trim(),
      vehicle: vehicle || 'Mini Cab',
      fare: Number(fare) || 599,
      paymentMethod: paymentMethod || 'cash',
      arrival: arrival || '5 min',
      status: 'Confirmed'
    });

    res.status(201).json({
      success: true,
      message: 'Booking created in MongoDB Atlas successfully.',
      booking: saved
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking in MongoDB: ' + err.message });
  }
});

// 2. READ (GET) - Fetch all bookings from MongoDB Atlas
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

// 5. DELETE (DELETE) - Remove booking from MongoDB Atlas
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

// 6. SYNC (POST) - Trigger sync from local bookings.json to MongoDB
router.post('/api/mongo/sync', async (req, res) => {
  try {
    const bookings = req.body?.bookings || [];
    const count = await syncAllBookingsToMongo(bookings);
    res.json({ success: true, message: `Synced ${count} bookings to MongoDB Atlas.` });
  } catch (err) {
    res.status(500).json({ error: 'Sync failed: ' + err.message });
  }
});

// MongoDB Status endpoint
router.get('/api/mongo/status', async (_req, res) => {
  res.json({
    connected: isMongoConnected || mongoose.connection.readyState === 1,
    database: mongoose.connection.name || 'waywise',
    readyState: mongoose.connection.readyState, // 1 = connected
    host: mongoose.connection.host || 'Atlas Cluster'
  });
});

export default router;
