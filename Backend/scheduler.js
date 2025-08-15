const cron = require('node-cron');
const { checkForEndedDealsAndSendEmails } = require('./sendRatingEmail');

// Runs every day at 5 PM
cron.schedule('0 17 * * *', () => {
    console.log('Running scheduled task to check for ended deals and send emails...');
    console.log('Current time:', new Date().toLocaleString());
  checkForEndedDealsAndSendEmails();
});
