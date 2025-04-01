const cron = require('node-cron');
const { checkRestockAndNotify } = require('../routes/restockroute');

// Schedule the task to run every day at midnight (00:00)
cron.schedule('0 0 * * *', () => {
  console.log('Running restock check...');
  checkRestockAndNotify();
});

console.log('Cron job scheduled: Checking restocks daily at midnight.');
