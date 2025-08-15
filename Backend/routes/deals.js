const express = require("express");
const deals = express.Router();
const DB = require('../db/dbConn.js');
const authenticate = require('./authMiddleware.js');
const sendMail = require('../utils/sendMail'); // Your email utility
const API_URL = process.env.REACT_APP_API_URL;

deals.post("/create", authenticate, async (req, res) => {
  try {
    const { timeFrom, timeTo, price, food, description, pet, serverId, serverEmail } = req.body;
    const userId = req.user.id;

    console.log(pet);

    const [petInfo] = await DB.getPet(pet, userId);
    console.log("Pet info:", petInfo);
    const [ownerInfo] = await DB.getUser(userId); /////////////////////////////////
    //console.log("Pet info:", petInfo);
    const result = await DB.addDeal({
      timeFrom: timeFrom.substring(0, 10), //first 10 characters of the date
      timeTo: timeTo.substring(0, 10), //first 10 characters of the date
      price,
      food,
      description,
      userId,
      serverId,
      pet: (petInfo.Id),
    });

    // Send the deal created email with Accept/Reject buttons
    await sendMail({
      to: serverEmail,
      subject: 'You received a new Deal Request on Petsitter',
      html: `
      <div
        style="font-family: Verdana, Geneva, sans-serif; max-width: 480px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
            <img src="${API_URL}/logo.png" alt="Petsitter Logo"
                style="width: 60px; margin-bottom: 12px;" />
            <h2 style="color: #4a90e2; margin: 0;">New Deal Request</h2>
        </div>
        <p>Hello,</p>
        <p>Good news!🎉 Are you ready for meeting another cute pet?</p>
        <p>You have received a new deal request from ${ownerInfo.Username} with the following details:</p>
        <ul style="padding-left: 18px;">
            <li><strong>Pet:</strong> ${petInfo.Name} the ${petInfo.Type} ${petInfo.Breed ? ` (${petInfo.Breed})` : ""}
            </li>
            <li><strong>From:</strong> ${timeFrom.slice(0, 10)}</li>
            <li><strong>To:</strong> ${timeTo.slice(0, 10)}</li>
            <li><strong>Price per day:</strong> ${price} €</li>
            <li><strong>Food:</strong> ${food}</li>
            <li><strong>Description:</strong> ${description}</li>
        </ul>
        <p>Here is the contact info:</p>
        <ul style="padding-left: 18px;">
            <li><strong>${ownerInfo.Name}'s phone number:</strong> ${ownerInfo.PhoneNo}</li>
            <li><strong>Email address:</strong> ${ownerInfo.Email}</li>
        </ul>
        <p>We suggest to first contact the pet owner to get some more details and maybe explain the service that you
            provide. Potentially meet before accepting or declining the deal.</p>
        <p>For any iregularities please email us at info.petsitter.si@gmail.com</p>
        <div style="text-align:center; margin: 24px 0;">
            <div style="text-align:center; margin: 24px 0;">
                <form action="${API_URL}/deals/accept/${result.insertId}" method="POST"
                    style="display:inline;">
                    <button type="submit"
                        style="background:#4a90e2; color:#fff; padding:6px 14px; font-size:14px; border-radius:4px; border:none; margin-right:8px; cursor:pointer;">
                        Accept Deal
                    </button>
                </form>
                <form action="${API_URL}/deals/reject/${result.insertId}" method="POST"
                    style="display:inline;">
                    <button type="submit"
                        style="background:#e24a4ae0; color:#fff; padding:6px 14px; font-size:14px; border-radius:4px; border:none; cursor:pointer;">
                        Reject Deal
                    </button>
                </form>
            </div>
        </div>
        <p style="color: #888; font-size: 13px; margin-top: 32px;">The Petsitter Team</p>
    </div>
    `
    });

    console.log(res)
    res.status(201).json({ message: "Deal created", dealId: res.insertId });

  } catch (err) {
    console.error("Failed to add deal:", err);
    res.status(500).json({ error: "Failed to add deal" });
  }
});


deals.post("/accept/:dealId", async (req, res) => {
  try {
    const dealId = req.params.dealId;
    await DB.updateDealStatus(dealId, 'accepted');

    const ownerEmail = await DB.getUserEmail(dealId);
    const [petsitter] = await DB.getPetSitterByDealId(dealId);
    await sendMail({
      to: ownerEmail,
      subject: 'Deal Accepted',
      html: `
       <div
        style="font-family: Verdana, Geneva, sans-serif; max-width: 480px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
            <img src="${API_URL}/logo.png" alt="Petsitter Logo"
                style="width: 60px; margin-bottom: 12px;" />
            <h2 style="color: #4a90e2; margin: 0;">Deal Accepted</h2>
        </div>

        <p>Hi there,</p>

        <p>Good news! 🎉 Your pet sitting request has been <strong>accepted</strong>.</p>

        <p>We assume you've already been in contact with the petsitter, but just in case, here are their details:</p>

        <ul style="padding-left: 18px;">
            <li><strong>${petsitter.Name}'s Phone:</strong> ${petsitter.PhoneNo}</li>
            <li><strong>Email:</strong> ${petsitter.Email}</li>
        </ul>

        <p>If you have any questions or need further support, feel free to reach out to us at <a
                href="mailto:info.petsitter.si@gmail.com">info.petsitter.si@gmail.com</a>.</p>

        <p>Thank you for using <strong>Petsitter</strong>. We hope your experience is smooth and pawsome! 🐾</p>

        <p style="color: #888; font-size: 13px; text-align: center; margin-top: 32px;">The Petsitter Team</p>
    </div>
      `
    });
    res.redirect(`${API_URL}/thankyou`);
  } catch (err) {
    console.error("Failed to accept deal:", err);
    res.status(500).json({ error: "Failed to accept deal" });
  }
});


deals.post("/reject/:dealId", authenticate, async (req, res) => {
  try {
    const dealId = req.params.dealId;
    await DB.updateDealStatus(dealId, 'rejected');

    const ownerEmail = await DB.getUserEmail(dealId);
    await sendMail({
      to: ownerEmail,
      subject: 'Deal Rejected',
      html: `
       <div
        style="font-family: Verdana, Geneva, sans-serif; max-width: 480px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
            <img src="${API_URL}/logo.png" alt="Petsitter Logo"
                style="width: 60px; margin-bottom: 12px;" />
            <h2 style="color: #4a90e2; margin: 0;">Deal Rejected</h2>
        </div>

        <p>Hi there,</p>

        <p>We’re sorry to let you know that your request for <strong>${petInfo.Name}</strong> was <strong>not
                accepted</strong>.</p>

        <p>But don’t worry, there are many wonderful petsitters still available and ready to take care of
            <strong>${petInfo.Name}</strong>! 🐾</p>

        <div style="text-align: center; margin: 24px 0;">
            <a href="${API_URL}"
                style="background-color: #4a90e2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-size: 14px;">
                Browse Petsitters
            </a>
        </div>

        <p>If you have any questions or need help, feel free to contact us at <a
                href="mailto:info.petsitter.si@gmail.com">info.petsitter.si@gmail.com</a>.</p>

        <p>Thanks for using <strong>Petsitter</strong>. We’re here to help you find the perfect match!</p>

        <p style="color: #888; font-size: 13px; text-align: center; margin-top: 32px;">The Petsitter Team</p>
    </div>
      `
    });
    res.redirect(`${API_URL}/thankyou`);
  } catch (err) {
    console.error("Failed to reject deal:", err);
    res.status(500).json({ error: "Failed to reject deal" });
  }
});

deals.get('/all', async (req, res, next) => {
  try {
    const queryResult = await DB.allDeals();
    console.log(queryResult);
    res.json(queryResult);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

deals.post('/:dealId/rate', async (req, res) => {
  try {
    const dealId = req.params.dealId;
    const { rating, description } = req.body;

    await DB.saveDealRating(dealId, rating, description);

    res.json({ message: "Rating submitted successfully." });
  } catch (err) {
    console.error("Failed to submit rating:", err);
    res.status(500).json({ error: "Failed to submit rating" });
  }
});

module.exports = deals;