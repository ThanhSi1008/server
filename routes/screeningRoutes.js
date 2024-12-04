const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Screening = require('../models/screening');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  try {
    const { date, movie_id } = req.query;

    console.log('Received date:', date);
    console.log('Received movie_id:', movie_id);

    if (!date || !movie_id) {
      return res.status(400).json({ error: 'Both date and movie_id query parameters are required.' });
    }

    if (!mongoose.Types.ObjectId.isValid(movie_id)) {
      return res.status(400).json({ error: 'Invalid movie_id format. Must be a 24-character hex string.' });
    }

    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

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
          },
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
          _id: 0,
          theater_name: '$_id.theater_name',
          address: '$_id.address',
          screenings: 1,
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
