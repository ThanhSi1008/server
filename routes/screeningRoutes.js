const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Screening = require('../models/screening')

// Route to get screenings by both date and movie_id

router.get('/', async (req, res) => {
  try {
    const { date, movie_id } = req.query

    console.log('Received date:', date)
    console.log('Received movie_id:', movie_id)


    // Validate that both parameters are provided
    if (!date || !movie_id) {
      return res.status(400).json({ error: 'Both date and movie_id query parameters are required.' })
    }

    // Validate `movie_id` format
    if (!mongoose.Types.ObjectId.isValid(movie_id)) {
      return res.status(400).json({ error: 'Invalid movie_id format. Must be a 24-character hex string.' })
    }

    // Parse the date and create a range for the full day
    const startOfDay = new Date(date)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    // Query the screenings collection
    const screenings = await Screening.find({
      movie_id, // Ensure proper ObjectId casting
      screening_time: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })

    res.status(200).json(screenings)
  } catch (error) {
    console.error('Error fetching screenings:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

<<<<<<< HEAD
module.exports = router
=======
module.exports = router
>>>>>>> f318d6c06469701594e919bcca775efe046cf1a9
