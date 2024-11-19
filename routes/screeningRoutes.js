const express = require('express')
const router = express.Router()
const Screening = require('../models/screening')

// Route to get all screenings on a specific date
router.get('/screenings', async (req, res) => {
  try {
    // Extract the date parameter from the query string
    const { date } = req.query

    if (!date) {
      return res.status(400).json({ error: 'Date query parameter is required' })
    }

    // Parse the date and create a range for the full day
    const startOfDay = new Date(date)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    // Query the screenings collection for screenings within the date range
    const screenings = await Screening.find({
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