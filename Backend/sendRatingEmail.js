const DB = require('./db/dbConn.js');
const sendMail = require('./utils/sendMail');
const API_URL = process.env.REACT_APP_API_URL;

async function checkForEndedDealsAndSendEmails() {

    console.log('Checking for deals that have ended today...');
    const result = await DB.getDealsThatEndsToday();

    console.log(`Found ${result.length} deals that have ended today. ${result.map(deal => deal.Id).join(', ')}`);

    for (const deal of result) {

        const [petsitter] = await DB.getUser(deal.ServerId);
        console.log(`Sending email to petsitter: ${petsitter.Email}`);
        await sendMail({
            to: petsitter.Email,
            subject: 'Your deal has ended',
            text: `Your deal with ID ${deal.Id} has ended. With the petsitter ${petsitter.Username}.`,
            //html: `<p>Your deal with ID <strong>${deal.Id}</strong> has ended. With the petsitter ${petsitter.Username}.</p>`
//             html: `<div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px;">
//   <div style="text-align: center; margin-bottom: 24px;">
//     <img src="cid:logo" alt="Petsitter Logo" style="width: 120px; margin-bottom: 12px;" />
//     <h2 style="color: #4a90e2;">Rate Your Petsitter Experience</h2>
//   </div>

//   <p>Hello,</p>
//   <p>Your recent petsitting deal has ended. We'd love to hear your feedback!</p>
//   <p>Please click below to rate your experience:</p>

//   <div style="text-align: center; margin: 24px 0;">
//     <a href="http://localhost:5006/rate/DEAL_ID?rating=1" style="font-size: 32px; text-decoration: none;">☆</a>
//     <a href="http://localhost:5006/rate/DEAL_ID?rating=2" style="font-size: 32px; text-decoration: none;">☆</a>
//     <a href="http://localhost:5006/rate/DEAL_ID?rating=3" style="font-size: 32px; text-decoration: none;">☆</a>
//     <a href="http://localhost:5006/rate/DEAL_ID?rating=4" style="font-size: 32px; text-decoration: none;">☆</a>
//     <a href="http://localhost:5006/rate/DEAL_ID?rating=5" style="font-size: 32px; text-decoration: none;">☆</a>
//   </div>

//   <p style="text-align: center;">Thanks for helping us improve Petsitter!</p>
//   <p style="color: #888; font-size: 13px; margin-top: 32px;">The Petsitter Team</p>
// </div>
// `
html: `
<div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px;">
  <div style="text-align: center; margin-bottom: 24px;">
    <img src="${API_URL}/logo.png" alt="Petsitter Logo" style="width: 120px; margin-bottom: 12px;" />
    <h2 style="color: #4a90e2;">Rate Your Petsitter Experience</h2>
  </div>

  <p>Hello,</p>
  <p>Your recent petsitting deal (ID: <strong>${deal.Id}</strong>) has ended.</p>
  <p>We’d love to hear your feedback and help us improve Petsitter!</p>

  <div style="text-align: center; margin: 24px 0;">
    <a href="${API_URL}/ratedeal/${deal.Id}"
       style="background-color: #4a90e2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
      Rate Your Experience
    </a>
  </div>

  <p>Thank you for trusting Petsitter!</p>
  <p style="color: #888; font-size: 13px; margin-top: 32px;">The Petsitter Team</p>
</div>

`
        });
    }
}

module.exports = { checkForEndedDealsAndSendEmails };
