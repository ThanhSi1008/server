const express = require('express')
const router = express.Router()
const Screening = require('../models/screening')

// Route to get screenings by both date and movie_id
router.get('/', async (req, res) => {
  try {
    // Extract the date and movie_id parameters from the query string
    const { date, movie_id } = req.query

    // Validate that both parameters are provided
    if (!date || !movie_id) {
      return res.status(400).json({ error: 'Both date and movie_id query parameters are required.' })
    }

    // Parse the date and create a range for the full day
    const startOfDay = new Date(date)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    // Query the screenings collection for matching records
    const screenings = await Screening.find({
      movie_id,
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

module.exports = router
