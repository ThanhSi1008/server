const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Screening = require('../models/screening');
const { protect } = require('../middleware/authMiddleware');

// Route to get screenings by date and movie_id, grouped by theater name and address
router.get('/', protect, async (req, res) => {
  try {
    const { date, movie_id } = req.query;

    console.log('Received date:', date);
    console.log('Received movie_id:', movie_id);

    // Validate that both parameters are provided
    if (!date || !movie_id) {
      return res.status(400).json({ error: 'Both date and movie_id query parameters are required.' });
    }

    // Validate `movie_id` format
    if (!mongoose.Types.ObjectId.isValid(movie_id)) {
      return res.status(400).json({ error: 'Invalid movie_id format. Must be a 24-character hex string.' });
    }

    // Parse the date and create a range for the full day
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Use aggregation to group screenings by theater name and address
    const screenings = await Screening.aggregate([
      {
        $match: {
          movie_id: new mongoose.Types.ObjectId(movie_id), // Ensure movie_id is treated as an ObjectId
          screening_time: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      },
      {
        $group: {
          _id: {
            theater_name: '$theater.theater_name',
            address: '$theater.address',
          }, // Group by theater name and address
          screenings: {
            $push: {
              screening_id: '$_id',
              screening_time: '$screening_time',
              end_time: '$end_time',
              room: '$room',
              seats: '$seats',
              ticket_price: '$ticket_price',
            },
          },
        },
      },
      {
        $project: {
          _id: 0, // Exclude the default `_id` field
          theater_name: '$_id.theater_name',
          address: '$_id.address',
          screenings: 1, // Include screenings array
        },
      },
    ]);

    res.status(200).json(screenings);
  } catch (error) {
    console.error('Error fetching screenings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
