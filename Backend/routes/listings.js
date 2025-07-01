const express = require("express");
const listings = express.Router();
const DB = require('../db/dbConn.js');
const authenticate = require('./authMiddleware.js');

// Add a new listing (protected route)
listings.post("/" ,  async (req, res) => { //
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
    try {
        const queryResult = await DB.allListings();
        console.log(queryResult);
        res.json(queryResult);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = listings;