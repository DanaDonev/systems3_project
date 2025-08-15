const express = require("express");
const listings = express.Router();
const DB = require('../db/dbConn.js');
const authenticate = require('./authMiddleware.js');

// Add a new listing (protected route)
listings.post("/", authenticate, async (req, res) => {
  try {
    const { PeriodFrom, PeriodTo, PetType, Description, Price } = req.body;
    const userId = req.user.id;

    const result = await DB.addListing({
      periodFrom: PeriodFrom,
      periodTo: PeriodTo,
      petType: PetType,
      description: Description,
      price: Price,
      userId,
    });

    console.log(result)
    res.status(201).json({ message: "Listing created", listingId: result.insertId });
  } catch (err) {
    console.error("Failed to add listing:", err);
    res.status(500).json({ error: "Failed to add listing" });
  }
});

listings.get('/all', async (req, res, next) => {
  const sortBy = req.query.sortBy || "timePeriod";
  try {
    const queryResult = await DB.allListings(sortBy);
    console.log(queryResult);
    res.json(queryResult);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

listings.delete('/delete', authenticate, async (req, res) => {
  try {
    const { id } = req.body;
    const deleted = await DB.deleteListing(id);
    console.log('Delete result:', id, deleted);

    if (!deleted) {
      return res.status(404).json({ message: 'Listing not found.' });
    }
    res.json({ message: 'Listing deleted successfully.' });
  } catch (err) {
    console.error('Delete listing error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = listings;