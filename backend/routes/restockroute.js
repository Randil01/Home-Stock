const express = require('express');
const router = express.Router();
const cron = require('node-cron'); 
const Grocery = require('../model/inventory');
const User = require('../model/emailModel');
const moment = require('moment');
const { sendEmail } = require('../utils/mailjet');

// Function to check restock items and notify users
const checkRestockAndNotify = async () => {
  try {
    const items = await Grocery.find();
    const users = await User.find();

    if (users.length === 0) {
      console.log('No users found to send notifications.');
      return;
    }

    const today = moment();
    const threeDaysFromNow = moment().add(3, 'days');

    const restockItems = items.filter(item =>
      moment(item.restockDate).isBetween(today, threeDaysFromNow, null, '[]') ||
      item.restockQuantity === 0
    );

    if (restockItems.length === 0) {
      console.log('✅ No restock items due in the next 3 days.');
      return;
    }

    for (const item of restockItems) {
      const subject = `🔔 Restock Alert: ${item.itemName}`;
      const text = `Dear User, 

The item "${item.itemName}" needs restocking by ${moment(item.restockDate).format('YYYY-MM-DD')}. 
Current stock: ${item.restockQuantity}.

Best regards, 
Home Stock`;

      for (const user of users) {
        await sendEmail(user.email, subject, text);  //Send emails one by one
      }
    }

    console.log('Restock notifications sent successfully.');
  } catch (error) {
    console.error(' Error checking restock items:', error);
  }
};

// API Route to Trigger Restock Check Manually
router.get('/checkRestock', async (req, res) => {
  try {
    await checkRestockAndNotify();
    res.status(200).json({ message: 'Restock check completed successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error in checking restock' });
  }
});

// Automate with a Cron Job
cron.schedule('*/5 * * * *', async () => {
  console.log('Running scheduled restock check...');
  await checkRestockAndNotify();
});

module.exports = router;
