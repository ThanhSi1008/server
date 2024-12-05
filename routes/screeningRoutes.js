const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Screening = require('../models/screening');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  try {
    const { date, movie_id } = req.query;

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

router.put('/update-seats', protect, async (req, res) => {
  try {
    const { screening_id, seat_locations } = req.body;

    if (!screening_id || !seat_locations || !Array.isArray(seat_locations) || seat_locations.length === 0) {
      return res.status(400).json({ error: 'screening_id and seat_locations array are required.' });
    }

    // Ensure that all seat locations are strings
    const seatLocations = seat_locations.map(seat => seat.trim());

    const matchedDocument = await Screening.findOne({
      _id: new mongoose.Types.ObjectId(screening_id),
      'seats.seat_location': { $in: seatLocations }
    });
    console.log('Matched Document:', matchedDocument);
    

    // Update the status of the seats directly in the screening document
    const updatedScreening = await Screening.updateOne(
      { _id: new mongoose.Types.ObjectId(screening_id) },
      { 
        $set: { 
          'seats.$[seat].status': false 
        }
      },
      {
        arrayFilters: [
          { 'seat.seat_location': { $in: seatLocations } }
        ],
        new: true // Optionally return the updated document
      }
    );

    if (updatedScreening.modifiedCount === 0) {
      return res.status(404).json({ error: 'No seats found to update.' });
    }

    // Respond with a success message
    res.status(200).json({
      message: 'Seats status updated successfully.',
      updatedSeats: seatLocations
    });
  } catch (error) {
    console.error('Error updating seat status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
