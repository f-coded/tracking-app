const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();

app.use(cors());
app.use(express.json()); // Middleware to parse JSON

// Default route to handle root requests
app.get('/api/', (req, res) => {
    res.send('Welcome to the Tracking API');
});

const TrackingSchema = new mongoose.Schema({
    trackingId: { type: String, required: true },
    events: [
        {
            date: { type: String, required: true },
            time: { type: String, required: true },
            description: { type: String, required: true },
            additionalInfo: { type: String },
            status: { 
                type: String, 
                enum: ['black', 'red', 'yellow', 'green', 'unknown-status'], 
                default: 'unknown-status' 
            },
        },
    ],
});

const TrackingData = mongoose.model('TrackingData', TrackingSchema);

// Route to get events by trackingId
app.get('/api/track/:trackingId', async (req, res) => {
    const { trackingId } = req.params;

    try {
        const trackingData = await TrackingData.findOne({ trackingId });

        if (!trackingData) {
            return res.status(404).json({ message: 'Tracking ID not found' });
        }

        res.json(trackingData);
    } catch (error) {
        console.error('Error fetching tracking data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000; // Use PORT from .env or default to 5000

const uri = process.env.MONGODB_URI; // Use MongoDB URI from .env

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((error) => console.error('Database connection error:', error));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
