const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json()); // Middleware to parse JSON

app.get('/', (req, res) => {
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
app.get('/track/:trackingId', async (req, res) => {
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

const PORT = process.env.PORT || 5000;



// Directly use the MongoDB URI in the code
const uri = 'mongodb+srv://Fcodes:connected@tracking-system-cluster.4ii4y.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((error) => console.error('Database connection error:', error));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
